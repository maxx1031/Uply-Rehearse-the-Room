import {
  buildInitialCourseProgress,
  buildInitialIntroMemory,
  SELF_INTRO_LESSONS,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
  type LessonMemoryCard,
} from "./selfIntroCourse";

export const COURSE_SCORE_STORAGE_KEY = "uply.courseScore";
export const COURSE_STREAK_STORAGE_KEY = "uply.courseStreak";

const COMPLETED_LESSONS_STORAGE_KEY = "uply.completedLessons";
const COURSE_PROGRESS_STORAGE_KEY = "uply.courseProgress";
const INTRO_MEMORY_STORAGE_KEY = "uply.introMemory";

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

export function progressFromCompletedCount(count: number): CourseProgress {
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

export function loadCourseProgress(): CourseProgress {
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

export function persistCourseProgress(progress: CourseProgress): void {
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

export function loadIntroMemory(): IntroMemory {
  if (typeof window === "undefined") return buildInitialIntroMemory();
  const raw = window.localStorage.getItem(INTRO_MEMORY_STORAGE_KEY);
  if (!raw) return buildInitialIntroMemory();
  try {
    return normalizeIntroMemory(JSON.parse(raw)) ?? buildInitialIntroMemory();
  } catch {
    return buildInitialIntroMemory();
  }
}

export function persistIntroMemory(memory: IntroMemory): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTRO_MEMORY_STORAGE_KEY, JSON.stringify(memory));
}

export function loadStoredNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function persistStoredNumber(key: string, value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(value));
}
