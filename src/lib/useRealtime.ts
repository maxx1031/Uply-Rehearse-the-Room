import { useCallback, useEffect, useRef, useState } from "react";

export type RealtimeStatus =
  | "idle"
  | "requesting-token"
  | "connecting"
  | "active"
  | "ending"
  | "error";

/** Scripted assistant/user turn used by the practice page's mock script. */
export type MockRealtimeTurn = { role: "assistant" | "user"; text: string; afterMs?: number };

export interface UseRealtimeOptions {
  /** Path to the serverless function that mints the ephemeral token. */
  tokenEndpoint?: string;
  /** Called with each Realtime API event (server-side) for debugging or UI updates. */
  onEvent?: (event: any) => void;
  /** Called when the model starts/stops speaking (audio output activity). */
  onSpeakingChange?: (speaking: boolean) => void;
  /** Probe the token endpoint on mount. Defaults to true. */
  probeOnMount?: boolean;
  /** JSON body sent when minting a Realtime client secret. */
  tokenRequestBody?: unknown;
  /** Script replayed in mock mode. */
  mockScript?: MockRealtimeTurn[];
  /** No-op here; accepted for compatibility with the practice page. */
  mockFinishArguments?: unknown;
  /** No-op here; accepted for compatibility with the practice page. */
  mockFunctionCall?: unknown;
}

export interface UseRealtimeReturn {
  status: RealtimeStatus;
  error: string | null;
  isAvailable: boolean;
  /** Latest transcript fragment from the model (rolling, replaced per response). */
  transcript: string;
  start: () => Promise<void>;
  stop: () => void;
  /** Push-to-talk: open the mic, clear any stale buffered audio, interrupt Maya
   *  if she's mid-sentence. Call on press-down. */
  beginTurn: () => void;
  /** Push-to-talk: commit the buffered audio and ask Maya to respond, then mute
   *  the mic. Call on release. */
  endTurn: () => void;
  /** Send a raw event over the data channel (e.g. function_call_output, response.create). */
  sendEvent: (event: unknown) => void;
  /** Practice-page compatibility shim: toggles the mic track's enabled flag. */
  setInputEnabled: (enabled: boolean) => void;
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

function buildTokenRequestInit(body: unknown): RequestInit {
  if (body === undefined) return { method: "POST" };
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
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
  // Index into MOCK_SCRIPT, advanced one assistant + one user turn per press.
  const cursorRef = useRef<number>(0);
  const finishSentRef = useRef(false);
  const script = opts.mockScript?.length ? opts.mockScript : MOCK_SCRIPT;

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setStatus("idle");
    setTranscript("");
    cursorRef.current = 0;
    finishSentRef.current = false;
  }, [cleanup]);

  // Play a scripted assistant turn with streamed transcript deltas.
  const playAssistant = useCallback((text: string, onDone?: () => void) => {
    opts.onEvent?.({ type: "response.created" });
    opts.onSpeakingChange?.(true);
    const chunks = text.match(/.{1,18}(\s|$)/g) ?? [text];
    let accumulated = "";
    chunks.forEach((chunk, i) => {
      const dT = setTimeout(() => {
        accumulated += chunk;
        setTranscript(accumulated);
        opts.onEvent?.({ type: "response.audio_transcript.delta", delta: chunk });
      }, i * 220);
      timersRef.current.push(dT);
    });
    const doneT = setTimeout(() => {
      opts.onSpeakingChange?.(false);
      opts.onEvent?.({ type: "response.audio_transcript.done", transcript: text });
      opts.onEvent?.({ type: "response.done" });
      onDone?.();
    }, chunks.length * 220 + 200);
    timersRef.current.push(doneT);
  }, [opts]);

  const start = useCallback(async () => {
    setTranscript("");
    cursorRef.current = 0;
    setStatus("requesting-token");
    const t1 = setTimeout(() => setStatus("connecting"), 300);
    const t2 = setTimeout(() => {
      setStatus("active");
      // Maya's opening line, mirroring the real opening response.create.
      const first = script[0];
      if (first?.role === "assistant") {
        cursorRef.current = 1;
        playAssistant(first.text);
      }
    }, 700);
    timersRef.current.push(t1, t2);
  }, [playAssistant, script]);

  const beginTurn = useCallback(() => {
    setTranscript("");
    opts.onEvent?.({ type: "input_audio_buffer.speech_started" });
  }, [opts]);

  const endTurn = useCallback(() => {
    // Emit the next scripted user line, then Maya's following reply.
    const userTurn = script[cursorRef.current];
    const userText = userTurn?.role === "user" ? userTurn.text : "Mm-hmm, yeah.";
    if (userTurn?.role === "user") cursorRef.current += 1;
    opts.onEvent?.({
      type: "conversation.item.input_audio_transcription.completed",
      transcript: userText,
    });
    const reply = script[cursorRef.current];
    const replyText = reply?.role === "assistant" ? reply.text : "Haha, totally. So tell me more!";
    if (reply?.role === "assistant") cursorRef.current += 1;
    const shouldFinishAfterReply = cursorRef.current >= script.length && !finishSentRef.current;
    const t = setTimeout(() => {
      playAssistant(replyText, () => {
        if (!shouldFinishAfterReply || finishSentRef.current || opts.mockFinishArguments === undefined) return;
        finishSentRef.current = true;
        opts.onEvent?.({
          type: "response.function_call_arguments.done",
          name: "finish_practice",
          call_id: "mock_finish_practice",
          arguments: JSON.stringify(opts.mockFinishArguments),
        });
      });
    }, 500);
    timersRef.current.push(t);
  }, [opts, playAssistant, script]);

  return {
    status,
    error: null,
    isAvailable: true,
    transcript,
    start,
    stop,
    beginTurn,
    endTurn,
    sendEvent: () => {},
    setInputEnabled: () => {},
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

  const statusRef = useRef<RealtimeStatus>("idle");
  const sessionIdRef = useRef(0);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  // True between response.created and response.done — lets beginTurn() barge in.
  const respondingRef = useRef<boolean>(false);
  // Timestamp of the last beginTurn — guards against committing a sub-100ms
  // buffer (which errors as input_audio_buffer_commit_empty).
  const turnStartRef = useRef<number>(0);

  const setRealtimeStatus = useCallback((next: RealtimeStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  // Probe the token endpoint once on mount so we can hide the mic button if
  // the server hasn't been configured yet.
  useEffect(() => {
    if (opts.probeOnMount === false) return;
    let cancelled = false;
    (async () => {
      try {
        const probe = await fetch(tokenEndpoint, buildTokenRequestInit(opts.tokenRequestBody));
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
  }, [opts.probeOnMount, opts.tokenRequestBody, tokenEndpoint]);

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
    respondingRef.current = false;
  }, []);

  const stop = useCallback(() => {
    sessionIdRef.current += 1;
    setRealtimeStatus("ending");
    cleanup();
    setRealtimeStatus("idle");
    setTranscript("");
  }, [cleanup, setRealtimeStatus]);

  const sendEvent = useCallback((event: unknown) => {
    const dc = dcRef.current;
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(event));
    }
  }, []);

  const beginTurn = useCallback(() => {
    // Barge-in: if Maya is talking, cut her off so the user can take the floor.
    if (respondingRef.current) {
      sendEvent({ type: "response.cancel" });
      respondingRef.current = false;
    }
    setTranscript("");
    turnStartRef.current = Date.now();
    // Discard everything buffered before the press; the mic keeps streaming, so
    // the press→release window is what gets committed.
    sendEvent({ type: "input_audio_buffer.clear" });
  }, [sendEvent]);

  const endTurn = useCallback(() => {
    // Commit the captured audio (→ transcription) and ask Maya to reply. Wait
    // out the 100ms minimum so a fast tap doesn't commit an empty buffer.
    const elapsed = Date.now() - turnStartRef.current;
    const commitAndRespond = () => {
      respondingRef.current = true;
      sendEvent({ type: "input_audio_buffer.commit" });
      sendEvent({ type: "response.create" });
    };
    if (elapsed >= 200) commitAndRespond();
    else setTimeout(commitAndRespond, 200 - elapsed);
  }, [sendEvent]);

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1;
      cleanup();
    };
  }, [cleanup]);

  const start = useCallback(async () => {
    if (
      statusRef.current === "requesting-token" ||
      statusRef.current === "connecting" ||
      statusRef.current === "active"
    ) {
      return;
    }

    const sessionId = sessionIdRef.current + 1;
    sessionIdRef.current = sessionId;
    cleanup();

    setError(null);
    setTranscript("");
    setRealtimeStatus("requesting-token");

    try {
      const tokenRes = await fetch(tokenEndpoint, buildTokenRequestInit(opts.tokenRequestBody));
      if (sessionIdRef.current !== sessionId) return;
      if (!tokenRes.ok) {
        const body = await tokenRes.text();
        throw new Error(`Token endpoint ${tokenRes.status}: ${body.slice(0, 200)}`);
      }
      const tokenJson = await tokenRes.json();
      if (sessionIdRef.current !== sessionId) return;
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

      setRealtimeStatus("connecting");
      if (sessionIdRef.current !== sessionId) return;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Inbound audio (model's voice) → autoplay <audio> element.
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        if (sessionIdRef.current !== sessionId) return;
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
      if (sessionIdRef.current !== sessionId) {
        mic.getTracks().forEach((t) => t.stop());
        try {
          pc.close();
        } catch {}
        audioEl.srcObject = null;
        audioEl.remove();
        return;
      }
      micStreamRef.current = mic;
      // Mic streams continuously over the media track (WebRTC suppresses muted
      // tracks as silence, so we must NOT gate with track.enabled). Turns are
      // delimited by input_audio_buffer.clear (press) / .commit (release).
      pc.addTrack(mic.getTracks()[0]);

      // Data channel for JSON events (transcripts, function calls, errors).
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      // With server VAD off, the model stays silent until asked. Kick off Maya's
      // opening line as soon as the channel is ready.
      dc.addEventListener("open", () => {
        if (sessionIdRef.current !== sessionId) return;
        respondingRef.current = true;
        dc.send(JSON.stringify({ type: "response.create" }));
      });
      dc.addEventListener("message", (e) => {
        if (sessionIdRef.current !== sessionId) return;
        try {
          const evt = JSON.parse(e.data);
          opts.onEvent?.(evt);
          // Pull the model's audio transcript out. Event names differ between the
          // beta (`response.audio_transcript.*`) and GA (`response.output_audio_transcript.*`)
          // interfaces, so match by suffix to support both.
          const t = typeof evt.type === "string" ? evt.type : "";
          if (t.endsWith("output_audio_transcript.delta") || t === "response.audio_transcript.delta") {
            if (typeof evt.delta === "string") setTranscript((prev) => prev + evt.delta);
          } else if (t.endsWith("output_audio_transcript.done") || t === "response.audio_transcript.done") {
            if (typeof evt.transcript === "string") setTranscript(evt.transcript);
          } else if (t === "response.created") {
            respondingRef.current = true;
            setTranscript("");
          } else if (t === "response.done") {
            respondingRef.current = false;
          } else if (t === "error") {
            // A too-short tap commits an empty buffer — harmless, don't alarm.
            if (evt.error?.code === "input_audio_buffer_commit_empty") {
              respondingRef.current = false;
            } else {
              setError(evt.error?.message ?? "Unknown realtime error");
            }
          }
        } catch {
          // Non-JSON message — ignore.
        }
      });

      const offer = await pc.createOffer();
      if (sessionIdRef.current !== sessionId) return;
      await pc.setLocalDescription(offer);
      if (sessionIdRef.current !== sessionId) return;

      const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeral}`,
          "Content-Type": "application/sdp",
        },
      });
      if (sessionIdRef.current !== sessionId) return;

      if (!sdpRes.ok) {
        const body = await sdpRes.text();
        throw new Error(`OpenAI SDP exchange ${sdpRes.status}: ${body.slice(0, 200)}`);
      }

      const answerSdp = await sdpRes.text();
      if (sessionIdRef.current !== sessionId) return;
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      if (sessionIdRef.current !== sessionId) return;

      pc.onconnectionstatechange = () => {
        if (sessionIdRef.current !== sessionId) return;
        const state = pc.connectionState;
        if (state === "connected") {
          setRealtimeStatus("active");
        } else if (state === "failed" || state === "disconnected" || state === "closed") {
          sessionIdRef.current += 1;
          cleanup();
          setRealtimeStatus("idle");
        }
      };

      setRealtimeStatus("active");
    } catch (err: any) {
      if (sessionIdRef.current !== sessionId) return;
      setError(err?.message ?? String(err));
      cleanup();
      setRealtimeStatus("error");
    }
  }, [tokenEndpoint, cleanup, opts, setRealtimeStatus]);

  const setInputEnabled = (enabled: boolean) => {
    micStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = enabled; });
  };
  return { status, error, isAvailable, transcript, start, stop, beginTurn, endTurn, sendEvent, setInputEnabled };
}
