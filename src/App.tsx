import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

// intro (from vercel build)
import { SplashScreen } from "./pages/intro/SplashScreen";
import { TicketScreen } from "./pages/intro/TicketScreen";
import { LoginScreen } from "./pages/intro/LoginScreen";
import { TicketConfirmOverlay } from "./pages/intro/TicketConfirmScreen";
import { CurtainScreen } from "./pages/intro/CurtainScreen";

// act-i (new after-party scene + handoff conversation/linkedin)
import { AfterPartyScene } from "./pages/act-i/AfterPartyScene";
import { ConversationScreen, LinkedInScreen } from "./pages/act-i/ActI";

// interlude (handoff)
import {
  AnalyzingScreen,
  ResultScreen,
  ReflectionScreen,
  type ArchetypeId,
  type ReflectionBucket,
} from "./pages/interlude/Interlude";

// epilogue (handoff)
import {
  GoalScreen,
  SloganScreen,
  HomeScreen,
  type GoalId,
} from "./pages/epilogue/Epilogue";
import { MissionPage } from "./pages/mission/MissionPage";
import { PracticePage } from "./pages/practice/PracticePage";
import { MissionCompletePage } from "./pages/practice/MissionCompletePage";
import { ReviewPage } from "./pages/practice/ReviewPage";
import {
  buildOnboardingProfile,
  type MemoryCard,
  type OnboardingProfile,
  type PracticeSessionResult,
  type TranscriptRecord,
} from "./lib/onboardingProfile";

type Step =
  // intro
  | "splash" | "ticket" | "login" | "curtain"
  // act-i
  | "after-party" | "conversation" | "linkedin"
  // interlude
  | "analyzing" | "result" | "reflection"
  // epilogue
  | "goal" | "slogan" | "home" | "mission" | "practice" | "mission-complete" | "review";

interface OverlayState {
  userName: string;
  showTitle: string;
  exiting: boolean;
}

const DEFAULT_ARCHETYPE: ArchetypeId = "quiet-observer";

const VALID_STEPS: Step[] = [
  "splash", "ticket", "login", "curtain",
  "after-party", "conversation", "linkedin",
  "analyzing", "result", "reflection",
  "goal", "slogan", "home", "mission", "practice", "mission-complete", "review",
];

function readStepFromUrl(): Step {
  if (typeof window === "undefined") return "splash";
  const param = new URLSearchParams(window.location.search).get("step");
  return (VALID_STEPS as string[]).includes(param ?? "") ? (param as Step) : "splash";
}

function isStepLocked(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("lockStep") === "1";
}

export default function App() {
  const [step, setStep] = useState<Step>(readStepFromUrl);
  const [dir, setDir] = useState(1);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [bucket, setBucket] = useState<ReflectionBucket | null>(null);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);
  const [sessionResult, setSessionResult] = useState<PracticeSessionResult | null>(null);
  const [, setTranscriptRecords] = useState<TranscriptRecord[]>([]);
  const [, setMemoryCards] = useState<MemoryCard[]>([]);
  const [points, setPoints] = useState(320);
  const [streak, setStreak] = useState(2);
  const [lastReward, setLastReward] = useState({ scoreDelta: 25, streak: 2 });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lockedRef = useRef<boolean>(isStepLocked());

  const go = (next: Step, direction = 1) => {
    if (lockedRef.current) return;
    setDir(direction);
    setStep(next);
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const showTicket = (name: string, showTitle: string) => {
    setUserName(name);
    setOverlay({ userName: name, showTitle, exiting: false });

    const t1 = setTimeout(() => {
      setOverlay((prev) => (prev ? { ...prev, exiting: true } : null));
    }, 3000);

    const t2 = setTimeout(() => {
      setOverlay(null);
      go("curtain");
    }, 3800);

    timersRef.current = [t1, t2];
  };

  const restartFlow = () => {
    setUserName(null);
    setBucket(null);
    setOnboardingProfile(null);
    setSessionResult(null);
    setTranscriptRecords([]);
    setMemoryCards([]);
    setPoints(320);
    setStreak(2);
    setLastReward({ scoreDelta: 25, streak: 2 });
    go("splash");
  };

  const pickGoal = (g: GoalId) => {
    setOnboardingProfile(buildOnboardingProfile({
      selectedGoal: g,
      archetypeId: DEFAULT_ARCHETYPE,
      reflectionBucket: bucket ?? "mid",
    }));
    go("slogan");
  };

  const completePractice = (result: PracticeSessionResult) => {
    const nextStreak = streak + 1;
    setSessionResult(result);
    setPoints((value) => value + result.scoreDelta);
    setStreak(nextStreak);
    setLastReward({ scoreDelta: result.scoreDelta, streak: nextStreak });
    setTranscriptRecords((records) => [
      ...records,
      {
        id: result.id,
        sceneTitle: result.sceneTitle,
        partnerName: result.partnerName,
        completionType: result.completionType,
        createdAt: result.endedAt,
        transcript: result.transcript,
      },
    ]);
    go("mission-complete");
  };

  const exitPractice = (record: TranscriptRecord) => {
    setTranscriptRecords((records) => [...records, record]);
    go("home");
  };

  const finishReview = (card: MemoryCard) => {
    setMemoryCards((cards) => [...cards, card]);
    go("home");
  };

  useEffect(() => clearTimers, []);

  const slideVariants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#e8e4df", minHeight: "100vh" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: "390px",
          height: "844px",
          maxHeight: "100vh",
          maxWidth: "100vw",
          borderRadius: "44px",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)",
          background: "#f5f2ee",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
          style={{ height: "48px" }}
        >
          <div className="w-28 h-7 rounded-full" style={{ background: "var(--bg-paper)" }} />
        </div>

        <motion.div
          className="absolute inset-0"
          animate={{
            filter: overlay ? "blur(7px) brightness(0.6)" : "blur(0px) brightness(1)",
            scale: overlay ? 1.04 : 1,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            {/* ── INTRO ── */}
            {step === "splash" && (
              <motion.div key="splash" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <SplashScreen onDone={() => go("ticket")} />
              </motion.div>
            )}

            {step === "ticket" && (
              <motion.div key="ticket" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
                <TicketScreen
                  onClaim={(name) => showTicket(name, "First Encounter")}
                  onLogin={() => go("login", 1)}
                />
              </motion.div>
            )}

            {step === "login" && (
              <motion.div key="login" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
                <LoginScreen
                  onBack={() => go("ticket", -1)}
                  onLogin={() => showTicket("Member", "Until We Meet Again")}
                />
              </motion.div>
            )}

            {step === "curtain" && (
              <motion.div key="curtain" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <CurtainScreen onDone={() => go("after-party")} />
              </motion.div>
            )}

            {/* ── ACT I ── */}
            {step === "after-party" && (
              <motion.div key="after-party" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
                <AfterPartyScene onDone={() => go("conversation")} />
              </motion.div>
            )}

            {step === "conversation" && (
              <motion.div key="conversation" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ConversationScreen
                  onComplete={() => go("linkedin")}
                  onSkip={() => go("goal")}
                />
              </motion.div>
            )}

            {step === "linkedin" && (
              <motion.div key="linkedin" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <LinkedInScreen onContinue={() => go("analyzing")} />
              </motion.div>
            )}

            {/* ── INTERLUDE (handoff) ── */}
            {step === "analyzing" && (
              <motion.div key="analyzing" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <AnalyzingScreen onDone={() => go("result")} />
              </motion.div>
            )}

            {step === "result" && (
              <motion.div key="result" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ResultScreen archetypeId={DEFAULT_ARCHETYPE} onContinue={() => go("reflection")} />
              </motion.div>
            )}

            {step === "reflection" && (
              <motion.div key="reflection" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ReflectionScreen onContinue={(b) => { setBucket(b); go("goal"); }} />
              </motion.div>
            )}

            {/* ── EPILOGUE (handoff) ── */}
            {step === "goal" && (
              <motion.div key="goal" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <GoalScreen onPick={pickGoal} />
              </motion.div>
            )}

            {step === "slogan" && (
              <motion.div key="slogan" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <SloganScreen onDone={() => go("home")} />
              </motion.div>
            )}

            {step === "home" && (
              <motion.div key="home" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <HomeScreen
                  user={userName ? { name: userName } : undefined}
                  points={points}
                  streak={streak}
                  onRestart={restartFlow}
                  onStartMission={() => go("mission")}
                />
              </motion.div>
            )}

            {step === "mission" && (
              <motion.div key="mission" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <MissionPage
                  profile={onboardingProfile}
                  onBack={() => go("home", -1)}
                  onStartPractice={() => go("practice")}
                />
              </motion.div>
            )}

            {step === "practice" && (
              <motion.div key="practice" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <PracticePage
                  profile={onboardingProfile}
                  onExit={exitPractice}
                  onComplete={completePractice}
                />
              </motion.div>
            )}

            {step === "mission-complete" && sessionResult && (
              <motion.div key="mission-complete" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <MissionCompletePage
                  scoreDelta={lastReward.scoreDelta}
                  streak={lastReward.streak}
                  onDone={() => go("review")}
                />
              </motion.div>
            )}

            {step === "review" && sessionResult && (
              <motion.div key="review" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ReviewPage
                  result={sessionResult}
                  streak={streak}
                  onTryAgain={() => go("mission", -1)}
                  onDone={finishReview}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {overlay && (
            <TicketConfirmOverlay
              userName={overlay.userName}
              showTitle={overlay.showTitle}
              exiting={overlay.exiting}
            />
          )}
        </AnimatePresence>

        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full z-50"
          style={{ background: "rgba(0,0,0,0.15)" }}
        />
      </div>
    </div>
  );
}
