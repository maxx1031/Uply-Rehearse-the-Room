import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ClipboardList, Mic, Pause, Play, X } from "lucide-react";
import sceneWithSilhouette from "@/assets/after-party/scene-with-silhouette.png";
import {
  buildDefaultOnboardingProfile,
  buildFallbackReviewDraft,
  type OnboardingProfile,
  type PracticeSessionResult,
  type PracticeTranscriptTurn,
  type ReviewDraft,
  type TranscriptRecord,
} from "@/lib/onboardingProfile";
import { type MockRealtimeTurn, useRealtime } from "@/lib/useRealtime";
import styles from "./PracticePage.module.css";

interface PracticePageProps {
  profile?: OnboardingProfile | null;
  onExit: (record: TranscriptRecord) => void;
  onComplete: (result: PracticeSessionResult) => void;
}

const MOCK_SCRIPT: MockRealtimeTurn[] = [
  { role: "assistant", text: "Hi, I am Jordan. I am glad we could find a few minutes for coffee.", afterMs: 800 },
  { role: "user", text: "Thanks for meeting me. I saw your CS alumni badge and wanted to ask about internships.", afterMs: 2200 },
  { role: "assistant", text: "Of course. I remember that search feeling confusing at first. What part feels most unclear right now?", afterMs: 1200 },
  { role: "user", text: "I am trying to understand how to choose my first product internship.", afterMs: 2600 },
  { role: "assistant", text: "That is a good small question. I would start by looking for teams where you can talk to users every week.", afterMs: 1300 },
  { role: "user", text: "Could I send you one quick question later about how you found your first role?", afterMs: 2500 },
  { role: "assistant", text: "Absolutely. Send me one focused question, and I will try to make the path feel less fuzzy.", afterMs: 1100 },
];

function id(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function PracticePage({ profile, onExit, onComplete }: PracticePageProps) {
  const activeProfile = profile ?? buildDefaultOnboardingProfile();
  const promptSeed = activeProfile.firstLessonPromptSeed;
  const startedAtRef = useRef(nowIso());
  const finishHandledRef = useRef(false);
  const transcriptRef = useRef<PracticeTranscriptTurn[]>([]);

  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeBubble, setActiveBubble] = useState<"assistant" | "user" | null>("assistant");
  const [assistantText, setAssistantText] = useState("");
  const [userText, setUserText] = useState("");
  const rtRef = useRef<ReturnType<typeof useRealtime> | null>(null);

  const appendTurn = useCallback((speaker: PracticeTranscriptTurn["speaker"], text: string) => {
    transcriptRef.current = [...transcriptRef.current, { id: id("turn"), speaker, text, createdAt: nowIso() }];
  }, []);

  const buildResult = useCallback((completionType: "natural" | "timeout", reviewDraft?: ReviewDraft): PracticeSessionResult => {
    const endedAt = nowIso();
    const currentTranscript = transcriptRef.current;
    const fallback = buildFallbackReviewDraft(currentTranscript, activeProfile);
    return {
      id: id("session"),
      sceneTitle: promptSeed.sceneTitle,
      partnerName: promptSeed.partnerName,
      completionType,
      startedAt: startedAtRef.current,
      endedAt,
      durationSeconds: Math.max(1, Math.round((Date.parse(endedAt) - Date.parse(startedAtRef.current)) / 1000)),
      transcript: currentTranscript,
      reviewDraft: reviewDraft ?? fallback,
      scoreDelta: 25,
    };
  }, [activeProfile, promptSeed.partnerName, promptSeed.sceneTitle]);

  const finishPractice = useCallback((completionType: "natural" | "timeout", reviewDraft?: ReviewDraft) => {
    if (finishHandledRef.current) return;
    finishHandledRef.current = true;
    onComplete(buildResult(completionType, reviewDraft));
  }, [buildResult, onComplete]);

  const handleEvent = useCallback((evt: any) => {
    const type = typeof evt?.type === "string" ? evt.type : "";

    if (type === "input_audio_buffer.speech_started") {
      setActiveBubble("user");
      setUserText("");
    }

    if (type === "response.created") {
      setActiveBubble("assistant");
      setAssistantText("");
    }

    if (type.endsWith("input_audio_transcription.delta") && typeof evt.delta === "string") {
      setUserText((value) => value + evt.delta);
    }

    if (type.endsWith("input_audio_transcription.completed") && typeof evt.transcript === "string") {
      const text = evt.transcript.trim();
      if (!text) return;
      setUserText(text);
      appendTurn("user", text);
    }

    if ((type.endsWith("output_audio_transcript.delta") || type === "response.audio_transcript.delta") && typeof evt.delta === "string") {
      setAssistantText((value) => value + evt.delta);
    }

    if ((type.endsWith("output_audio_transcript.done") || type === "response.audio_transcript.done") && typeof evt.transcript === "string") {
      const text = evt.transcript.trim();
      if (!text) return;
      setAssistantText(text);
      appendTurn("assistant", text);
    }

    if (type === "response.function_call_arguments.done" && evt.name === "finish_practice") {
      const draft = buildFallbackReviewDraft(transcriptRef.current, activeProfile);
      rtRef.current?.sendEvent({
        type: "conversation.item.create",
        item: { type: "function_call_output", call_id: evt.call_id, output: JSON.stringify({ ok: true }) },
      });
      finishPractice("natural", draft);
    }
  }, [activeProfile, appendTurn, finishPractice]);

  const rt = useRealtime({
    probeOnMount: false,
    tokenRequestBody: { flow: "mission", promptSeed },
    mockScript: MOCK_SCRIPT,
    mockFinishArguments: { reason: "clear_small_ask" },
    onEvent: handleEvent,
  });
  rtRef.current = rt;

  useEffect(() => {
    startedAtRef.current = nowIso();
    rt.start();
    return () => rt.stop();
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (elapsedSeconds >= 600) {
      finishPractice("timeout");
    }
  }, [elapsedSeconds, finishPractice]);

  const pause = () => {
    setPaused(true);
    rt.setInputEnabled(false);
    rt.sendEvent({ type: "response.cancel" });
    rt.sendEvent({ type: "output_audio_buffer.clear" });
  };

  const resume = () => {
    setPaused(false);
    rt.setInputEnabled(true);
  };

  const confirmExit = () => {
    rt.stop();
    onExit({
      id: id("record"),
      sceneTitle: promptSeed.sceneTitle,
      partnerName: promptSeed.partnerName,
      completionType: "exit",
      createdAt: nowIso(),
      transcript: transcriptRef.current,
    });
  };

  const bubbleText = activeBubble === "user" ? userText : assistantText || rt.transcript;

  return (
    <div className={styles.screen}>
      <img className={styles.backdrop} src={sceneWithSilhouette} alt="" />
      <div className={styles.vignette} />

      <div className={styles.taskPanel}>
        <button className={styles.taskHeader} onClick={() => setTasksExpanded((value) => !value)}>
          <span><ClipboardList size={16} />Tasks</span>
          <ChevronDown size={16} className={tasksExpanded ? styles.chevronOpen : styles.chevron} />
        </button>
        {tasksExpanded && (
          <div className={styles.taskList}>
            {promptSeed.tasks.map((task) => (
              <div className={styles.taskItem} key={task}><span />{task}</div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.nameLabel}>{promptSeed.partnerName}</div>

      {bubbleText && (
        <div className={activeBubble === "user" ? styles.userBubble : styles.assistantBubble}>
          {bubbleText}
        </div>
      )}

      {rt.status === "error" && (
        <div className={styles.errorText}>{rt.error ?? "Realtime unavailable"}</div>
      )}

      <div className={styles.bottomControls}>
        <button className={styles.circleButton} onClick={() => setShowExitConfirm(true)} aria-label="Exit practice">
          <X size={22} />
        </button>
        <button className={styles.micButton} onClick={() => (rt.status === "idle" || rt.status === "error") && rt.start()}>
          <Mic size={27} />
          <span>{rt.status === "requesting-token" || rt.status === "connecting" ? "Connecting" : "Tap to speak"}</span>
        </button>
        <button className={styles.circleButton} onClick={pause} aria-label="Pause practice">
          <Pause size={21} fill="currentColor" />
        </button>
      </div>

      {paused && (
        <div className={styles.pauseLayer}>
          <button className={styles.resumeButton} onClick={resume}>
            <Play size={18} fill="currentColor" />
            Resume
          </button>
        </div>
      )}

      {showExitConfirm && (
        <div className={styles.confirmLayer}>
          <div className={styles.confirmCard}>
            <div className={styles.confirmTitle}>End practice?</div>
            <div className={styles.confirmBody}>Your transcript will be saved, but this will not count as a completed mission.</div>
            <div className={styles.confirmActions}>
              <button className={styles.secondaryButton} onClick={() => setShowExitConfirm(false)}>Continue</button>
              <button className={styles.primaryButton} onClick={confirmExit}>End</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
