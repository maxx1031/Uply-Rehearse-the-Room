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
import { HomeScreen, type HomeTab } from "./pages/home/HomeScreen";
import { ProfileScreen } from "./pages/profile/ProfileScreen";
import { MissionPage } from "./pages/mission/MissionPage";
import { PracticePage } from "./pages/practice/PracticePage";
import { MissionCompletePage } from "./pages/practice/MissionCompletePage";
import { ReviewPage } from "./pages/practice/ReviewPage";
import {
  buildDefaultOnboardingProfile,
  buildOnboardingProfile,
  type MemoryCard,
  type PracticeSessionResult,
  type TranscriptRecord,
} from "./lib/onboardingProfile";
import {
  applyLessonMemory,
  buildCourseReviewDraft,
  buildInitialCourseProgress,
  buildInitialIntroMemory,
  buildLessonMemoryCard,
  buildLessonPromptSeed,
  completeLesson,
  getLessonById,
  getNextLessonId,
  type CourseLessonId,
} from "./lib/selfIntroCourse";

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
  const [, setUserName] = useState<string | null>(null);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [bucket, setBucket] = useState<ReflectionBucket | null>(null);
  const [sessionResult, setSessionResult] = useState<PracticeSessionResult | null>(null);
  const [courseProgress, setCourseProgress] = useState(buildInitialCourseProgress);
  const [introMemory, setIntroMemory] = useState(buildInitialIntroMemory);
  const [activeLessonId, setActiveLessonId] = useState<CourseLessonId>("level-1");
  const [homeInitialTab, setHomeInitialTab] = useState<HomeTab>("home");
  const [score, setScore] = useState(320);
  const [streak, setStreak] = useState(2);
  const [, setTranscriptRecords] = useState<TranscriptRecord[]>([]);
  const [, setMemoryCards] = useState<MemoryCard[]>([]);

  const onboardingProfile = useMemo(() => {
    if (!goalId) return buildDefaultOnboardingProfile();
    return buildOnboardingProfile({
      selectedGoal: goalId,
      archetypeId: DEFAULT_ARCHETYPE,
      reflectionBucket: bucket ?? "mid",
    });
  }, [goalId, bucket]);
  const activeLesson = useMemo(() => getLessonById(activeLessonId), [activeLessonId]);
  const activePromptSeed = useMemo(
    () => buildLessonPromptSeed(activeLesson, introMemory),
    [activeLesson, introMemory],
  );
  const courseProfile = useMemo(
    () => ({ ...onboardingProfile, firstLessonPromptSeed: activePromptSeed }),
    [activePromptSeed, onboardingProfile],
  );
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
    setUserName(name);
    setCurtainOpen(false);
    go("curtain");

    const t1 = setTimeout(() => {
      setOverlay({ userName: name, showTitle, exiting: false });
    }, 400);

    const t2 = setTimeout(() => {
      setOverlay((prev) => (prev ? { ...prev, exiting: true } : null));
    }, 3400);

    const t3 = setTimeout(() => {
      setOverlay(null);
      setCurtainOpen(true);
    }, 4200);

    timersRef.current = [t1, t2, t3];
  };

  const startLesson = (lessonId: CourseLessonId) => {
    setActiveLessonId(lessonId);
    setHomeInitialTab("home");
    go("mission");
  };

  const handlePracticeComplete = (result: PracticeSessionResult) => {
    const completedAt = new Date().toISOString();
    const card = buildLessonMemoryCard(activeLesson, result.transcript);
    const nextMemory = applyLessonMemory(introMemory, activeLesson, card);
    const nextProgress = completeLesson(courseProgress, activeLesson.id, completedAt);
    const reviewDraft = activeLesson.isChallenge
      ? buildCourseReviewDraft(nextMemory, result.reviewDraft)
      : result.reviewDraft;

    setIntroMemory(nextMemory);
    setCourseProgress(nextProgress);
    setScore((value) => value + activeLesson.scoreDelta);
    setStreak((value) => value + 1);
    setSessionResult({ ...result, scoreDelta: activeLesson.scoreDelta, reviewDraft });
    go("mission-complete");
  };

  const goCourseMap = () => {
    setHomeInitialTab("learn");
    go("home", -1);
  };

  const goNextLesson = () => {
    const nextLessonId = getNextLessonId(activeLesson.id);
    if (!nextLessonId) {
      goCourseMap();
      return;
    }
    setActiveLessonId(nextLessonId);
    go("mission", 1);
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
      style={{ background: "var(--bg-paper)", minHeight: "100vh" }}
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
          background: "var(--bg-cream)",
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
                  progress={courseProgress}
                  memory={introMemory}
                  score={score}
                  streak={streak}
                  initialTab={homeInitialTab}
                  onStartLesson={(lessonId) => startLesson(lessonId)}
                />
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div key="profile" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
                <ProfileScreen
                  onBack={() => go("home", -1)}
                />
              </motion.div>
            )}

            {step === "mission" && (
              <motion.div key="mission" className="absolute inset-0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}>
                <MissionPage
                  profile={courseProfile}
                  lesson={activeLesson}
                  memory={introMemory}
                  onBack={() => go("home", -1)}
                  onStartPractice={() => go("practice")}
                />
              </motion.div>
            )}

            {step === "practice" && (
              <motion.div key="practice" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <PracticePage
                  profile={courseProfile}
                  lesson={activeLesson}
                  memory={introMemory}
                  onExit={(record) => { setTranscriptRecords((records) => [record, ...records]); go("home", -1); }}
                  onComplete={handlePracticeComplete}
                />
              </motion.div>
            )}

            {step === "mission-complete" && (
              <motion.div key="mission-complete" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <MissionCompletePage
                  scoreDelta={activeLesson.scoreDelta}
                  variant={activeLesson.isChallenge ? "challenge" : "lesson"}
                  title={activeLesson.isChallenge ? "Challenge Complete" : "Level Complete"}
                  subtitle=""
                  realWorldPrompt={activeLesson.realWorldPrompt}
                  secondaryLabel={activeLesson.isChallenge ? undefined : "Course map"}
                  primaryLabel={activeLesson.isChallenge ? "Back" : getNextLessonId(activeLesson.id) ? "Next level" : "Course map"}
                  onSecondary={activeLesson.isChallenge ? undefined : goCourseMap}
                  onPrimary={activeLesson.isChallenge ? goCourseMap : goNextLesson}
                />
              </motion.div>
            )}

            {step === "review" && sessionResult && (
              <motion.div key="review" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ReviewPage
                  result={sessionResult}
                  streak={streak}
                  onTryAgain={() => go("mission")}
                  onDone={(card) => { setMemoryCards((cards) => [card, ...cards]); go("home", -1); }}
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
