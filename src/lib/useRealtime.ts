import { useCallback, useEffect, useRef, useState } from "react";

export type RealtimeStatus =
  | "idle"
  | "requesting-token"
  | "connecting"
  | "active"
  | "ending"
  | "error";

export type MockRealtimeTurn = {
  role: "assistant" | "user";
  text: string;
  afterMs: number;
};

export type MockRealtimeFunctionCall = {
  name: string;
  arguments: unknown;
  callId?: string;
  afterMs?: number;
};

export interface UseRealtimeOptions {
  tokenEndpoint?: string;
  tokenRequestBody?: unknown;
  probeOnMount?: boolean;
  mockScript?: MockRealtimeTurn[];
  mockFunctionCall?: MockRealtimeFunctionCall;
  mockFinishArguments?: unknown;
  onEvent?: (event: any) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

export interface UseRealtimeReturn {
  status: RealtimeStatus;
  error: string | null;
  isAvailable: boolean;
  transcript: string;
  start: () => Promise<void>;
  stop: () => void;
  sendEvent: (event: unknown) => void;
  setInputEnabled: (enabled: boolean) => void;
}

function isMockMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const m = params.get("mock");
  return m === "1" || m === "true";
}

const DEFAULT_MOCK_SCRIPT: MockRealtimeTurn[] = [
  { role: "assistant", text: "Hey! I think I've seen you around. I'm Sam. What brings you here?", afterMs: 1200 },
  { role: "user", text: "Just grabbed a coffee. I'm here for the workshop.", afterMs: 3200 },
  { role: "assistant", text: "Oh nice! Which one? I'm trying to decide between two of them.", afterMs: 1400 },
  { role: "user", text: "The product strategy one at 3pm. Heard it's pretty good.", afterMs: 3000 },
  { role: "assistant", text: "Cool, I'll check that one out too. What do you do, if you don't mind me asking?", afterMs: 1400 },
];

function postTokenInit(endpoint: string, body: unknown): Promise<Response> {
  if (body === undefined) {
    return fetch(endpoint, { method: "POST" });
  }

  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function useRealtimeMockImpl(opts: UseRealtimeOptions): UseRealtimeReturn {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [transcript, setTranscript] = useState("");
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
    opts.onSpeakingChange?.(false);
  }, [cleanup, opts]);

  const start = useCallback(async () => {
    cleanup();
    setTranscript("");
    setStatus("requesting-token");
    const t1 = setTimeout(() => setStatus("connecting"), 180);
    const t2 = setTimeout(() => setStatus("active"), 420);
    timersRef.current.push(t1, t2);

    let cursor = 520;
    const script = opts.mockScript ?? DEFAULT_MOCK_SCRIPT;
    script.forEach((turn) => {
      cursor += turn.afterMs;
      if (turn.role === "user") {
        const started = setTimeout(() => {
          opts.onEvent?.({ type: "input_audio_buffer.speech_started" });
          const completed = setTimeout(() => {
            opts.onEvent?.({ type: "input_audio_buffer.speech_stopped" });
            opts.onEvent?.({
              type: "conversation.item.input_audio_transcription.completed",
              transcript: turn.text,
            });
          }, 760);
          timersRef.current.push(completed);
        }, cursor);
        timersRef.current.push(started);
        return;
      }

      const assistantStarted = setTimeout(() => {
        opts.onEvent?.({ type: "response.created" });
        opts.onSpeakingChange?.(true);
        const chunks = turn.text.match(/.{1,18}(\s|$)/g) ?? [turn.text];
        let accumulated = "";
        chunks.forEach((chunk, index) => {
          const delta = setTimeout(() => {
            accumulated += chunk;
            setTranscript(accumulated);
            opts.onEvent?.({ type: "response.output_audio_transcript.delta", delta: chunk });
          }, index * 180);
          timersRef.current.push(delta);
        });

        const done = setTimeout(() => {
          opts.onSpeakingChange?.(false);
          setTranscript(turn.text);
          opts.onEvent?.({ type: "response.output_audio_transcript.done", transcript: turn.text });
        }, chunks.length * 180 + 120);
        timersRef.current.push(done);
      }, cursor);
      timersRef.current.push(assistantStarted);
    });

    const mockFunctionCall = opts.mockFunctionCall ??
      (opts.mockFinishArguments
        ? {
            name: "finish_practice",
            callId: "mock_finish_practice",
            arguments: opts.mockFinishArguments,
            afterMs: 1900,
          }
        : null);

    if (mockFunctionCall) {
      const finish = setTimeout(() => {
        opts.onEvent?.({
          type: "response.function_call_arguments.done",
          name: mockFunctionCall.name,
          call_id: mockFunctionCall.callId ?? `mock_${mockFunctionCall.name}`,
          arguments: JSON.stringify(mockFunctionCall.arguments),
        });
      }, cursor + (mockFunctionCall.afterMs ?? 1900));
      timersRef.current.push(finish);
    }
  }, [cleanup, opts]);

  return {
    status,
    error: null,
    isAvailable: true,
    transcript,
    start,
    stop,
    sendEvent: () => {},
    setInputEnabled: () => {},
  };
}

export function useRealtime(opts: UseRealtimeOptions = {}): UseRealtimeReturn {
  const mock = useRef<boolean | null>(null);
  if (mock.current === null) mock.current = isMockMode();
  if (mock.current) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRealtimeMockImpl(opts);
  }

  const tokenEndpoint = opts.tokenEndpoint ?? "/api/realtime-token";

  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const shouldProbe = opts.probeOnMount ?? true;
  const [isAvailable, setIsAvailable] = useState(!shouldProbe);
  const [transcript, setTranscript] = useState("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!shouldProbe) {
      setIsAvailable(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const probe = await postTokenInit(tokenEndpoint, opts.tokenRequestBody);
        if (!cancelled) setIsAvailable(probe.ok);
      } catch {
        if (!cancelled) setIsAvailable(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [opts.tokenRequestBody, shouldProbe, tokenEndpoint]);

  const setInputEnabled = useCallback((enabled: boolean) => {
    micStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  const cleanup = useCallback(() => {
    try {
      dcRef.current?.close();
    } catch {}
    try {
      pcRef.current?.getSenders().forEach((sender) => sender.track?.stop());
      pcRef.current?.close();
    } catch {}
    try {
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch {}
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    pcRef.current = null;
    dcRef.current = null;
    micStreamRef.current = null;
    opts.onSpeakingChange?.(false);
  }, [opts]);

  const stop = useCallback(() => {
    setStatus("ending");
    cleanup();
    setStatus("idle");
    setTranscript("");
  }, [cleanup]);

  const sendEvent = useCallback((event: unknown) => {
    const dc = dcRef.current;
    if (dc?.readyState === "open") {
      dc.send(JSON.stringify(event));
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    setStatus("requesting-token");

    try {
      const tokenRes = await postTokenInit(tokenEndpoint, opts.tokenRequestBody);
      if (!tokenRes.ok) {
        const body = await tokenRes.text();
        throw new Error(`Token endpoint ${tokenRes.status}: ${body.slice(0, 200)}`);
      }

      const tokenJson = await tokenRes.json();
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

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
        const track = event.streams[0]?.getAudioTracks()[0];
        if (track) {
          track.onmute = () => opts.onSpeakingChange?.(false);
          track.onunmute = () => opts.onSpeakingChange?.(true);
        }
      };

      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = mic;
      pc.addTrack(mic.getAudioTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("message", (event) => {
        try {
          const evt = JSON.parse(event.data);
          opts.onEvent?.(evt);
          const type = typeof evt.type === "string" ? evt.type : "";

          if (type.endsWith("output_audio_transcript.delta") || type === "response.audio_transcript.delta") {
            if (typeof evt.delta === "string") setTranscript((prev) => prev + evt.delta);
          } else if (type.endsWith("output_audio_transcript.done") || type === "response.audio_transcript.done") {
            if (typeof evt.transcript === "string") setTranscript(evt.transcript);
          } else if (type === "response.created") {
            setTranscript("");
          } else if (type === "error") {
            setError(evt.error?.message ?? "Unknown realtime error");
          }
        } catch {
          // Ignore non-JSON data channel messages.
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
  }, [cleanup, opts, tokenEndpoint]);

  return { status, error, isAvailable, transcript, start, stop, sendEvent, setInputEnabled };
}
