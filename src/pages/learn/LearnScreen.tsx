import { useEffect, useRef } from "react";
import { Check, Lock, Mic2, Play, Sparkles, Target, Trophy, Wand2 } from "lucide-react";
import {
  SELF_INTRO_LESSONS,
  getCurrentLesson,
  isLessonComplete,
  isLessonUnlocked,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
  type LessonConfig,
} from "@/lib/selfIntroCourse";
import styles from "./LearnScreen.module.css";

const STEP = 194;

const LESSON_ICONS = [Target, Mic2, Sparkles, Wand2, Trophy];

interface LearnScreenProps {
  progress: CourseProgress;
  memory: IntroMemory;
  onStartLesson: (lessonId: CourseLessonId) => void;
}

function getLessonStatus(progress: CourseProgress, lesson: LessonConfig) {
  if (isLessonComplete(progress, lesson.id)) return "done";
  if (!isLessonUnlocked(progress, lesson.id)) return "locked";
  if (getCurrentLesson(progress).id === lesson.id) return "active";
  return "ready";
}

function getCardMemory(memory: IntroMemory, lessonId: CourseLessonId): string {
  return memory.lessonCards.find((card) => card.lessonId === lessonId)?.value ?? "Memory slot waiting";
}

export function LearnScreen({ progress, memory, onStartLesson }: LearnScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = SELF_INTRO_LESSONS.findIndex((lesson) => getCurrentLesson(progress).id === lesson.id);
  const completedCount = progress.completedLessonIds.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = Math.max(0, activeIndex * STEP);
  }, [activeIndex]);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>YOUR REHEARSAL MAP</div>
        <h1>Alumni coffee intro</h1>
        <p>{completedCount}/5 levels completed</p>
      </header>

      <div ref={scrollRef} className={styles.stackScroller}>
        <div className={styles.stackPad} />
        {SELF_INTRO_LESSONS.map((lesson, index) => {
          const status = getLessonStatus(progress, lesson);
          const Icon = LESSON_ICONS[index] ?? Target;
          const canStart = status !== "locked";
          return (
            <button
              key={lesson.id}
              className={`${styles.folder} ${styles[status]}`}
              style={{ marginBottom: index === SELF_INTRO_LESSONS.length - 1 ? 0 : undefined }}
              onClick={() => canStart && onStartLesson(lesson.id)}
              disabled={!canStart}
            >
              <span className={styles.folderTab} />
              <span className={styles.folderBody}>
                <span className={styles.folderTop}>
                  <span className={styles.iconWrap}><Icon size={22} /></span>
                  <span className={styles.levelLabel}>Level {lesson.level}</span>
                </span>
                <span>
                  <span className={styles.title}>{lesson.title}</span>
                  <span className={styles.subtitle}>{lesson.subtitle}</span>
                </span>
                <span className={styles.memoryLine}>{getCardMemory(memory, lesson.id)}</span>
                <span className={styles.folderBottom}>
                  <span>{lesson.outcomeLabel}</span>
                  <span className={styles.statusPill}>
                    {status === "done" && <Check size={15} />}
                    {status === "active" && <Play size={14} fill="currentColor" />}
                    {status === "ready" && <Play size={14} fill="currentColor" />}
                    {status === "locked" && <Lock size={14} />}
                    {status === "done" ? "Done" : status === "locked" ? "Locked" : "Start"}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
        <div className={styles.stackTail} />
      </div>

      <section className={styles.memoryShelf}>
        <div>
          <div className={styles.shelfTitle}>Intro Memory</div>
          <p>{memory.customizedIntro ?? memory.professionalAnchor ?? "Your reusable intro will appear here as you rehearse."}</p>
        </div>
      </section>
    </div>
  );
}
