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
import { loadStoredUserName, persistUserName, PROFILE_CONSTANTS } from "./lib/profileConfig";
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
  SELF_INTRO_LESSONS,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
  type LessonMemoryCard,
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
const COMPLETED_LESSONS_STORAGE_KEY = "uply.completedLessons";
const COURSE_PROGRESS_STORAGE_KEY = "uply.courseProgress";
const INTRO_MEMORY_STORAGE_KEY = "uply.introMemory";
const COURSE_SCORE_STORAGE_KEY = "uply.courseScore";
const COURSE_STREAK_STORAGE_KEY = "uply.courseStreak";
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

function progressFromCompletedCount(count: number): CourseProgress {
  const safeCount = Math.max(0, Math.min(5, Math.floor(count)));
  const completedLessonIds = SELF_INTRO_LESSONS.slice(0, safeCount).map((lesson) => lesson.id);
  const currentLessonId = SELF_INTRO_LESSONS[Math.min(safeCount, SELF_INTRO_LESSONS.length - 1)].id;
  return {
    ...buildInitialCourseProgress(),
    currentLessonId,
    completedLessonIds,
  };
}

function normalizeCourseProgress(value: unknown): CourseProgress | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<CourseProgress>;
  const lessonIds = new Set<CourseLessonId>(SELF_INTRO_LESSONS.map((lesson) => lesson.id));
  const completedLessonIds = Array.isArray(raw.completedLessonIds)
    ? raw.completedLessonIds.filter((id): id is CourseLessonId => lessonIds.has(id as CourseLessonId))
    : [];
  const currentLessonId = lessonIds.has(raw.currentLessonId as CourseLessonId)
    ? raw.currentLessonId as CourseLessonId
    : SELF_INTRO_LESSONS[Math.min(completedLessonIds.length, SELF_INTRO_LESSONS.length - 1)].id;
  return {
    themeId: "alumni-coffee-intro",
    currentLessonId,
    completedLessonIds,
    lastPracticedAt: typeof raw.lastPracticedAt === "string" ? raw.lastPracticedAt : null,
  };
}

function loadCourseProgress(): CourseProgress {
  if (typeof window === "undefined") return buildInitialCourseProgress();
  const raw = window.localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = normalizeCourseProgress(JSON.parse(raw));
      if (parsed) return parsed;
    } catch {}
  }
  return progressFromCompletedCount(loadCompletedLessonCount());
}

function persistCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  persistCompletedLessonCount(progress.completedLessonIds.length);
}

function normalizeLessonCards(value: unknown): LessonMemoryCard[] {
  if (!Array.isArray(value)) return [];
  const lessonIds = new Set<CourseLessonId>(SELF_INTRO_LESSONS.map((lesson) => lesson.id));
  return value.filter((item): item is LessonMemoryCard => {
    if (!item || typeof item !== "object") return false;
    const raw = item as Partial<LessonMemoryCard>;
    return (
      typeof raw.id === "string" &&
      lessonIds.has(raw.lessonId as CourseLessonId) &&
      typeof raw.label === "string" &&
      typeof raw.value === "string" &&
      typeof raw.createdAt === "string"
    );
  });
}

function normalizeIntroMemory(value: unknown): IntroMemory | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<IntroMemory>;
  return {
    identityAnchor: typeof raw.identityAnchor === "string" ? raw.identityAnchor : null,
    professionalAnchor: typeof raw.professionalAnchor === "string" ? raw.professionalAnchor : null,
    curiosityHook: typeof raw.curiosityHook === "string" ? raw.curiosityHook : null,
    customizedIntro: typeof raw.customizedIntro === "string" ? raw.customizedIntro : null,
    finalIntro: typeof raw.finalIntro === "string" ? raw.finalIntro : null,
    nextSmallAsk: typeof raw.nextSmallAsk === "string" ? raw.nextSmallAsk : null,
    lessonCards: normalizeLessonCards(raw.lessonCards),
  };
}

function loadIntroMemory(): IntroMemory {
  if (typeof window === "undefined") return buildInitialIntroMemory();
  const raw = window.localStorage.getItem(INTRO_MEMORY_STORAGE_KEY);
  if (!raw) return buildInitialIntroMemory();
  try {
    return normalizeIntroMemory(JSON.parse(raw)) ?? buildInitialIntroMemory();
  } catch {
    return buildInitialIntroMemory();
  }
}

function persistIntroMemory(memory: IntroMemory): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTRO_MEMORY_STORAGE_KEY, JSON.stringify(memory));
}

function loadStoredNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function persistStoredNumber(key: string, value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(value));
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
  const [courseProgress, setCourseProgress] = useState<CourseProgress>(() => loadCourseProgress());
  const [introMemory, setIntroMemory] = useState<IntroMemory>(() => loadIntroMemory());
  const [activeLessonId, setActiveLessonId] = useState<CourseLessonId>(() => courseProgress.currentLessonId);
  const [homeInitialTab, setHomeInitialTab] = useState<HomeTab>("home");
  const [score, setScore] = useState<number>(() => loadStoredNumber(COURSE_SCORE_STORAGE_KEY, 14000));
  const [streak, setStreak] = useState<number>(() => loadStoredNumber(COURSE_STREAK_STORAGE_KEY, 10));
  const [, setTranscriptRecords] = useState<TranscriptRecord[]>([]);
  const [, setMemoryCards] = useState<MemoryCard[]>([]);
  const debugModeEnabled =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

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
    const resetProgress = buildInitialCourseProgress();
    const resetMemory = buildInitialIntroMemory();
    setUserName(PROFILE_CONSTANTS.defaultUserName);
    persistUserName(PROFILE_CONSTANTS.defaultUserName);
    setGoalId(null);
    setBucket(null);
    setCourseProgress(resetProgress);
    setIntroMemory(resetMemory);
    setActiveLessonId(resetProgress.currentLessonId);
    setHomeInitialTab("home");
    setScore(14000);
    setStreak(10);
    persistCourseProgress(resetProgress);
    persistIntroMemory(resetMemory);
    persistStoredNumber(COURSE_SCORE_STORAGE_KEY, 14000);
    persistStoredNumber(COURSE_STREAK_STORAGE_KEY, 10);
    go("splash");
  };

  const handleSetCompletedLessons = (value: number) => {
    const nextProgress = progressFromCompletedCount(value);
    setCourseProgress(nextProgress);
    setActiveLessonId(nextProgress.currentLessonId);
    setHomeInitialTab("learn");
    persistCourseProgress(nextProgress);
  };

  const startLesson = (lessonId: CourseLessonId) => {
    setActiveLessonId(lessonId);
    setHomeInitialTab("learn");
    go("practice");
  };

  const handlePracticeComplete = (result: PracticeSessionResult) => {
    const completedAt = new Date().toISOString();
    const card = buildLessonMemoryCard(activeLesson, result.transcript);
    const nextMemory = applyLessonMemory(introMemory, activeLesson, card);
    const nextProgress = completeLesson(courseProgress, activeLesson.id, completedAt);
    const reviewDraft = activeLesson.isChallenge
      ? buildCourseReviewDraft(nextMemory, result.reviewDraft)
      : result.reviewDraft;
    const nextScore = score + activeLesson.scoreDelta;
    const nextStreak = streak + 1;

    setIntroMemory(nextMemory);
    setCourseProgress(nextProgress);
    setScore(nextScore);
    setStreak(nextStreak);
    setSessionResult({ ...result, scoreDelta: activeLesson.scoreDelta, reviewDraft });
    persistIntroMemory(nextMemory);
    persistCourseProgress(nextProgress);
    persistStoredNumber(COURSE_SCORE_STORAGE_KEY, nextScore);
    persistStoredNumber(COURSE_STREAK_STORAGE_KEY, nextStreak);
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
    go("practice", 1);
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
      style={{ background: "#e8e4df", minHeight: "100dvh" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: "390px",
          height: "844px",
          maxHeight: "100dvh",
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
                  progress={courseProgress}
                  memory={introMemory}
                  score={score}
                  streak={streak}
                  initialTab={homeInitialTab}
                  debugModeEnabled={debugModeEnabled}
                  onSetCompletedLessons={handleSetCompletedLessons}
                  onStartLesson={(lessonId) => startLesson(lessonId)}
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
                <MissionCompletePage scoreDelta={activeLesson.scoreDelta} streak={streak} onDone={goNextLesson} />
              </motion.div>
            )}

            {step === "review" && sessionResult && (
              <motion.div key="review" className="absolute inset-0" variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <ReviewPage
                  result={sessionResult}
                  streak={streak}
                  onTryAgain={() => go("practice")}
                  onDone={(card) => { setMemoryCards((cards) => [card, ...cards]); goCourseMap(); }}
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
