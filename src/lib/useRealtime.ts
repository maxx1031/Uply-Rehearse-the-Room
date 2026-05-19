import { useCallback, useEffect, useRef, useState } from "react";

export type RealtimeStatus =
  | "idle"
  | "requesting-token"
  | "connecting"
  | "active"
  | "ending"
  | "error";

export interface UseRealtimeOptions {
  /** Path to the serverless function that mints the ephemeral token. */
  tokenEndpoint?: string;
  /** Called with each Realtime API event (server-side) for debugging or UI updates. */
  onEvent?: (event: any) => void;
  /** Called when the model starts/stops speaking (audio output activity). */
  onSpeakingChange?: (speaking: boolean) => void;
}

export interface UseRealtimeReturn {
  status: RealtimeStatus;
  error: string | null;
  isAvailable: boolean;
  /** Latest transcript fragment from the model (rolling, replaced per response). */
  transcript: string;
  start: () => Promise<void>;
  stop: () => void;
}

/**
 * Manages the lifecycle of a WebRTC peer connection to OpenAI's Realtime API.
 * Flow:
 *   1. Fetch ephemeral token from our /api/realtime-token endpoint.
 *   2. getUserMedia({ audio: true }) → grab microphone track.
 *   3. RTCPeerConnection → addTrack(mic), createDataChannel("oai-events"),
 *      createOffer, setLocalDescription.
 *   4. POST SDP offer to https://api.openai.com/v1/realtime/calls with
 *      Authorization: Bearer <ephemeral>.
 *   5. setRemoteDescription with the SDP answer the response body contains.
 *   6. ontrack delivers the model's audio; route into an <audio> element.
 *
 * Disposing: stop() closes the peer connection, stops the mic track, and
 * removes the audio element.
 */
/**
 * Returns true if the URL has `?mock=1` (or `?mock=true`). In mock mode we
 * skip the OpenAI Realtime API entirely and replay a scripted conversation
 * — useful for free end-to-end flow testing without burning tokens.
 */
function isMockMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const m = params.get("mock");
  return m === "1" || m === "true";
}

/** Scripted dialogue replayed in mock mode. Keep at >=3 assistant turns so the
 *  onboarding flow's `triggerAfterRounds={3}` reaches the active-turn handoff. */
const MOCK_SCRIPT: { role: "assistant" | "user"; text: string; afterMs: number }[] = [
  { role: "assistant", text: "Hey! I think I've seen you around. I'm Sam — what brings you here?", afterMs: 1200 },
  { role: "user", text: "Just grabbed a coffee — I'm here for the workshop.", afterMs: 3200 },
  { role: "assistant", text: "Oh nice! Which one? I'm trying to decide between two of them.", afterMs: 1400 },
  { role: "user", text: "The product strategy one at 3pm. Heard it's pretty good.", afterMs: 3000 },
  { role: "assistant", text: "Cool, I'll check that one out too. What do you do, if you don't mind me asking?", afterMs: 1400 },
];

function useRealtimeMockImpl(opts: UseRealtimeOptions): UseRealtimeReturn {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setStatus("idle");
    setTranscript("");
  }, [cleanup]);

  const start = useCallback(async () => {
    setTranscript("");
    setStatus("requesting-token");
    const t1 = setTimeout(() => setStatus("connecting"), 300);
    const t2 = setTimeout(() => setStatus("active"), 700);
    timersRef.current.push(t1, t2);

    // Schedule the scripted turns.
    let cursor = 700;
    MOCK_SCRIPT.forEach((turn) => {
      cursor += turn.afterMs;
      const at = cursor;
      if (turn.role === "user") {
        const t = setTimeout(() => {
          opts.onEvent?.({ type: "input_audio_buffer.speech_started" });
          const stopT = setTimeout(() => {
            opts.onEvent?.({ type: "input_audio_buffer.speech_stopped" });
            opts.onEvent?.({
              type: "conversation.item.input_audio_transcription.completed",
              transcript: turn.text,
            });
          }, 1100);
          timersRef.current.push(stopT);
        }, at);
        timersRef.current.push(t);
      } else {
        const startT = setTimeout(() => {
          opts.onSpeakingChange?.(true);
          // Stream a few transcript deltas for a typing-like effect.
          const chunks = turn.text.match(/.{1,18}(\s|$)/g) ?? [turn.text];
          let accumulated = "";
          chunks.forEach((chunk, i) => {
            const dT = setTimeout(() => {
              accumulated += chunk;
              setTranscript(accumulated);
              opts.onEvent?.({ type: "response.audio_transcript.delta", delta: chunk });
            }, i * 240);
            timersRef.current.push(dT);
          });
          const doneT = setTimeout(() => {
            opts.onSpeakingChange?.(false);
            setTranscript("");
            opts.onEvent?.({ type: "response.audio_transcript.done", transcript: turn.text });
          }, chunks.length * 240 + 200);
          timersRef.current.push(doneT);
        }, at);
        timersRef.current.push(startT);
      }
    });
  }, [opts]);

  return {
    status,
    error: null,
    isAvailable: true,
    transcript,
    start,
    stop,
  };
}

export function useRealtime(opts: UseRealtimeOptions = {}): UseRealtimeReturn {
  // Switch to mock implementation if `?mock=1` is in the URL. The hook is
  // called the same way and surfaces the same shape — only the data is fake.
  const mock = useRef<boolean | null>(null);
  if (mock.current === null) mock.current = isMockMode();
  if (mock.current) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRealtimeMockImpl(opts);
  }

  const tokenEndpoint = opts.tokenEndpoint ?? "/api/realtime-token";

  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Probe the token endpoint once on mount so we can hide the mic button if
  // the server hasn't been configured yet.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const probe = await fetch(tokenEndpoint, { method: "POST" });
        if (cancelled) return;
        if (probe.status === 503) {
          setIsAvailable(false);
        } else if (probe.ok) {
          // We just minted a token we won't use; that's fine, it'll expire in
          // ~60s. The cost of doing so is negligible.
          setIsAvailable(true);
        } else {
          setIsAvailable(true); // unknown — let the user try; surface errors then
        }
      } catch {
        if (!cancelled) setIsAvailable(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tokenEndpoint]);

  const cleanup = useCallback(() => {
    try {
      dcRef.current?.close();
    } catch {}
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    try {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    pcRef.current = null;
    dcRef.current = null;
    micStreamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    setStatus("ending");
    cleanup();
    setStatus("idle");
    setTranscript("");
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    setStatus("requesting-token");

    try {
      const tokenRes = await fetch(tokenEndpoint, { method: "POST" });
      if (!tokenRes.ok) {
        const body = await tokenRes.text();
        throw new Error(`Token endpoint ${tokenRes.status}: ${body.slice(0, 200)}`);
      }
      const tokenJson = await tokenRes.json();
      // OpenAI may nest the secret under a few different shapes depending on
      // API version; check a couple before giving up.
      const ephemeral =
        tokenJson?.value ??
        tokenJson?.client_secret?.value ??
        tokenJson?.client_secret ??
        null;
      if (typeof ephemeral !== "string" || ephemeral.length < 10) {
        throw new Error(`Token endpoint returned no usable secret: ${JSON.stringify(tokenJson).slice(0, 200)}`);
      }

      setStatus("connecting");

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Inbound audio (model's voice) → autoplay <audio> element.
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        if (e.streams[0]) {
          const track = e.streams[0].getAudioTracks()[0];
          if (track) {
            track.onmute = () => opts.onSpeakingChange?.(false);
            track.onunmute = () => opts.onSpeakingChange?.(true);
          }
        }
      };

      // Outbound audio (user's mic) → first track on the peer.
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = mic;
      pc.addTrack(mic.getTracks()[0]);

      // Data channel for JSON events (transcripts, function calls, errors).
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("message", (e) => {
        try {
          const evt = JSON.parse(e.data);
          opts.onEvent?.(evt);
          // Pull transcript fragments out of the most common event types so
          // the UI can show what the model is saying.
          if (evt.type === "response.audio_transcript.delta" && typeof evt.delta === "string") {
            setTranscript((t) => t + evt.delta);
          } else if (evt.type === "response.audio_transcript.done" && typeof evt.transcript === "string") {
            setTranscript(evt.transcript);
          } else if (evt.type === "response.done") {
            // Keep last transcript visible until the next response begins.
          } else if (evt.type === "response.created") {
            setTranscript("");
          } else if (evt.type === "error") {
            setError(evt.error?.message ?? "Unknown realtime error");
          }
        } catch {
          // Non-JSON message — ignore.
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeral}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpRes.ok) {
        const body = await sdpRes.text();
        throw new Error(`OpenAI SDP exchange ${sdpRes.status}: ${body.slice(0, 200)}`);
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === "connected") {
          setStatus("active");
        } else if (state === "failed" || state === "disconnected" || state === "closed") {
          cleanup();
          setStatus("idle");
        }
      };

      setStatus("active");
    } catch (err: any) {
      setError(err?.message ?? String(err));
      cleanup();
      setStatus("error");
    }
  }, [tokenEndpoint, cleanup, opts]);

  return { status, error, isAvailable, transcript, start, stop };
}
