import { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

// intro (from vercel build)
import { SplashScreen } from "./pages/intro/SplashScreen";
import { TicketScreen } from "./pages/intro/TicketScreen";
import { LoginScreen } from "./pages/intro/LoginScreen";
import { TicketConfirmOverlay } from "./pages/intro/TicketConfirmScreen";
import { CurtainScreen } from "./pages/intro/CurtainScreen";

// act-i (new after-party scene + conversation)
import { AfterPartyScene } from "./pages/act-i/AfterPartyScene";
import { ConversationScreen } from "./pages/act-i/ActI";

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
  type GoalId,
} from "./pages/epilogue/Epilogue";
import { HomeScreen } from "./pages/home/HomeScreen";
import { ProfileScreen } from "./pages/profile/ProfileScreen";
import { MissionPage } from "./pages/mission/MissionPage";
import { PracticePage } from "./pages/practice/PracticePage";
import { MissionCompletePage } from "./pages/practice/MissionCompletePage";
import { ReviewPage } from "./pages/practice/ReviewPage";
import {
  buildDefaultOnboardingProfile,
  buildOnboardingProfile,
  type PracticeSessionResult,
} from "./lib/onboardingProfile";
import { loadStoredUserName, persistUserName, PROFILE_CONSTANTS } from "./lib/profileConfig";

type Step =
  // intro
  | "splash" | "ticket" | "login" | "curtain"
  // act-i
  | "after-party" | "conversation"
  // interlude
  | "analyzing" | "result" | "reflection"
  // epilogue
  | "goal" | "slogan" | "home"
  // profile
  | "profile"
  // practice loop (new)
  | "mission" | "practice" | "mission-complete" | "review";

interface OverlayState {
  userName: string;
  showTitle: string;
  exiting: boolean;
}

const DEFAULT_ARCHETYPE: ArchetypeId = "quiet-observer";

const VALID_STEPS: Step[] = [
  "splash", "ticket", "login", "curtain",
  "after-party", "conversation",
  "analyzing", "result", "reflection",
  "goal", "slogan", "home",
  "profile",
  "mission", "practice", "mission-complete", "review",
];
const COMPLETED_LESSONS_STORAGE_KEY = "uply.completedLessons";
const HOME_TODO_STORAGE_KEY = "uply.review.todos";
const DEFAULT_HOME_TODOS = [
  "Review one LinkedIn opener before noon",
  "Send one warm follow-up message after coffee chat",
  "Draft a 3-line thank-you note for a mentor",
] as const;

function loadCompletedLessonCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(COMPLETED_LESSONS_STORAGE_KEY);
  const value = Number(raw);
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 5) return 5;
  return Math.floor(value);
}

function persistCompletedLessonCount(value: number): void {
  if (typeof window === "undefined") return;
  const safeValue = Math.max(0, Math.min(5, Math.floor(value)));
  window.localStorage.setItem(COMPLETED_LESSONS_STORAGE_KEY, String(safeValue));
}

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
  const [userName, setUserName] = useState<string>(() => loadStoredUserName() ?? PROFILE_CONSTANTS.defaultUserName);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [bucket, setBucket] = useState<ReflectionBucket | null>(null);
  const [sessionResult, setSessionResult] = useState<PracticeSessionResult | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number>(() => loadCompletedLessonCount());

  const onboardingProfile = useMemo(() => {
    if (!goalId) return buildDefaultOnboardingProfile();
    // 5-point UI bucket → 3-bucket downstream profile (left/mid/right)
    const profileBucket: "left" | "mid" | "right" =
      bucket === null || bucket === 2 ? "mid" :
      bucket <= 1 ? "left" : "right";
    return buildOnboardingProfile({
      selectedGoal: goalId,
      archetypeId: DEFAULT_ARCHETYPE,
      reflectionBucket: profileBucket,
    });
  }, [goalId, bucket]);
  const [curtainOpen, setCurtainOpen] = useState(false);
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
    const displayName = name.trim() || PROFILE_CONSTANTS.defaultUserName;
    setUserName(displayName);
    persistUserName(displayName);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HOME_TODO_STORAGE_KEY, JSON.stringify([...DEFAULT_HOME_TODOS]));
      window.dispatchEvent(new CustomEvent("uply:todos-updated", { detail: [...DEFAULT_HOME_TODOS] }));
    }
    setCurtainOpen(false);
    go("curtain");

    const t1 = setTimeout(() => {
      setOverlay({ userName: name, showTitle, exiting: false });
    }, 180);

    const t2 = setTimeout(() => {
      setOverlay((prev) => (prev ? { ...prev, exiting: true } : null));
    }, 1100);

    const t3 = setTimeout(() => {
      setOverlay(null);
      setCurtainOpen(true);
    }, 1550);

    timersRef.current = [t1, t2, t3];
  };

  const restartFlow = () => {
    setUserName(PROFILE_CONSTANTS.defaultUserName);
    persistUserName(PROFILE_CONSTANTS.defaultUserName);
    setGoalId(null);
    setBucket(null);
    setCompletedLessons(0);
    persistCompletedLessonCount(0);
    go("splash");
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
                  onLogin={(name) => showTicket(name, "Until We Meet Again")}
                />
              </motion.div>
            )}

            {step === "curtain" && (
              <motion.div key="curtain" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <CurtainScreen onDone={() => go("after-party")} startOpen={curtainOpen} />
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
                  onComplete={() => go("analyzing")}
                  onSkip={() => go("goal")}
                  onDebugSkip={() => { lockedRef.current = false; go("analyzing"); }}
                />
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
                <GoalScreen onPick={(g) => { setGoalId(g); go("slogan"); }} />
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
                  userName={userName}
                  onRestart={restartFlow}
                  completedLessons={completedLessons}
                  onStartMission={() => go("mission")}
                />
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div key="profile" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
                <ProfileScreen onBack={() => go("home", -1)} />
              </motion.div>
            )}

            {step === "mission" && (
              <motion.div key="mission" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
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
                  onExit={() => go("home", -1)}
                  onComplete={(result: PracticeSessionResult) => {
                    setSessionResult(result);
                    setCompletedLessons((prev) => {
                      const next = Math.min(5, prev + 1);
                      persistCompletedLessonCount(next);
                      return next;
                    });
                    go("mission-complete");
                  }}
                />
              </motion.div>
            )}

            {step === "mission-complete" && (
              <motion.div key="mission-complete" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <MissionCompletePage scoreDelta={120} streak={3} onDone={() => go("review")} />
              </motion.div>
            )}

            {step === "review" && sessionResult && (
              <motion.div key="review" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ReviewPage
                  result={sessionResult}
                  streak={3}
                  onTryAgain={() => go("practice")}
                  onDone={() => go("home", -1)}
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
