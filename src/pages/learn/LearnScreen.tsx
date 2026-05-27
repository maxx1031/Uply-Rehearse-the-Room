import { useEffect, useRef, useState } from "react";
import { ScrollText, Lock, ChevronLeft, Target, Sparkles } from "lucide-react";
import statCalendar from "@/assets/imports/1.png";
import statSapphire from "@/assets/imports/2.png";
import statStar     from "@/assets/imports/3.png";
import statMask     from "@/assets/imports/4.png";
import lessonBgEarly from "@/assets/lesson/Gemini_Generated_Image_up3ghoup3ghoup3g.png";
import lessonBgLate from "@/assets/lesson/Gemini_Generated_Image_cqktntcqktntcqkt.png";
import lessonP1 from "@/assets/lesson/p1.png";
import lessonP2 from "@/assets/lesson/p2.png";
import lessonP3 from "@/assets/lesson/p3.png";
import lessonP4 from "@/assets/lesson/p4.png";
import lessonP5 from "@/assets/lesson/p5.png";
import { PROFILE_CONSTANTS } from "@/lib/profileConfig";
import {
  getCurrentLesson,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
} from "@/lib/selfIntroCourse";
import map0 from "@/assets/Map/Map0.png";
import map1 from "@/assets/Map/Map 1.png";
import map2 from "@/assets/Map/Map 2.png";
import map3 from "@/assets/Map/Map 3.png";
import map4 from "@/assets/Map/Map 4.png";
import map5 from "@/assets/Map/Map 5.png";

interface LearnScreenProps {
  progress: CourseProgress;
  memory: IntroMemory;
  onStartLesson: (lessonId: CourseLessonId) => void;
  debugModeEnabled?: boolean;
  onSetCompletedLessons?: (value: number) => void;
}

const STATS = [
  { img: statCalendar, value: PROFILE_CONSTANTS.homeActiveDays },
  { img: statSapphire, value: "Sapphire" },
  { img: statStar,     value: "14,000"   },
  { img: statMask,     value: "95min"    },
];
const MAP_STAGES = [map0, map1, map2, map3, map4, map5] as const;
const LESSON_P_IMAGES = {
  1: lessonP1,
  2: lessonP2,
  3: lessonP3,
  4: lessonP4,
  5: lessonP5,
} as const;

function clampCompletedLessons(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 5) return 5;
  return Math.floor(value);
}

/* ─── Phases — 4 个阶段, 只有 Phase 1 unlocked ─────────────── */
type PhaseStatus = "active" | "locked";
interface Phase {
  num: number;
  partLabel: string;     // "Phase 1 · Part 1"
  title: string;
  blurb: string;         // locked 卡的小字说明
  status: PhaseStatus;
}

// 围绕 CS master → RA → internship → fulltime 的人生主线 4 段
const PHASES: Phase[] = [
  { num: 1, partLabel: "Phase 1 · Part 1", title: "Self Introduction",
    blurb: "Learning to introduce yourself in low-stakes everyday scenes.",
    status: "active" },
  { num: 2, partLabel: "Phase 2 · Part 1", title: "Lab Outreach",
    blurb: "Reaching out to PhDs and PIs about research — cold emails, follow-ups, intros.",
    status: "locked" },
  { num: 3, partLabel: "Phase 3 · Part 1", title: "Internship Hunt",
    blurb: "Recruiter pings, technical screens, take-home asks.",
    status: "locked" },
  { num: 4, partLabel: "Phase 4 · Part 1", title: "Full-time Search",
    blurb: "Negotiation, references, the offer dance.",
    status: "locked" },
];

interface StickyBannerTheme {
  partLabel: string;
  title: string;
  background: string;
  titleColor: string;
  subtitleColor: string;
}

const STICKY_BANNER_THEMES: Record<number, StickyBannerTheme> = {
  1: {
    partLabel: "Phase 1 · Part 1",
    title: "Self Introduction",
    background: "#6B63D4",
    titleColor: "#FFFFFF",
    subtitleColor: "rgba(255,255,255,0.72)",
  },
  2: {
    partLabel: "Phase 1 · Part 2",
    title: "Lab Outreach",
    background: "#E5EAA0",
    titleColor: "#1a1830",
    subtitleColor: "rgba(26,24,48,0.62)",
  },
  3: {
    partLabel: "Phase 1 · Part 3",
    title: "Internship Hunt",
    background: "#9FE1AC",
    titleColor: "#1a1830",
    subtitleColor: "rgba(26,24,48,0.62)",
  },
  4: {
    partLabel: "Phase 1 · Part 4",
    title: "Full-time Search",
    background: "#FFB86B",
    titleColor: "#1a1830",
    subtitleColor: "rgba(26,24,48,0.62)",
  },
};

/* ─── Active Phase header (purple banner, inline) ─── */
function ActivePhaseHeader({
  partLabel,
  title,
  background,
  titleColor,
  subtitleColor,
  sticky = false,
}: {
  partLabel: string;
  title: string;
  background: string;
  titleColor: string;
  subtitleColor: string;
  sticky?: boolean;
}) {
  return (
    <div style={{
      background,
      borderRadius: 16,
      padding: "13px 16px",
      marginRight: 28, marginBottom: 18,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: sticky ? "0 8px 20px rgba(20,20,80,0.2)" : "0 4px 18px rgba(107,99,212,0.32)",
      position: sticky ? "sticky" : "relative",
      top: sticky ? 0 : "auto",
      zIndex: sticky ? 30 : "auto",
    }}>
      <div>
        <div style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 600,
          fontSize: "11px", color: subtitleColor, letterSpacing: "0.05em",
        }}>
          {partLabel}
        </div>
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
          fontSize: "22px", color: titleColor, lineHeight: 1.15, marginTop: 2,
        }}>
          {title}
        </div>
      </div>
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: titleColor === "#FFFFFF" ? "rgba(255,255,255,0.16)" : "rgba(26,24,48,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ScrollText size={22} color={titleColor} strokeWidth={1.8} />
      </div>
    </div>
  );
}

/* ─── Locked Phase card (placeholder for phases 2-4) ─── */
function LockedPhaseCard({ phase }: { phase: Phase }) {
  return (
    <div style={{
      marginRight: 28,
      background: "white",
      borderRadius: 20,
      padding: "22px 20px 24px",
      boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 10, textAlign: "center",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: "#f0ede8",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Lock size={24} color="#b8b4d0" strokeWidth={1.8} />
      </div>

      <div style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 600,
        fontSize: "11px", color: "#b8b4d0", letterSpacing: "0.05em",
      }}>
        {phase.partLabel}
      </div>

      <div style={{
        fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
        fontSize: "22px", color: "#1a1830", lineHeight: 1.15,
      }}>
        Phase {phase.num} · {phase.title}
      </div>

      <p style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 500,
        fontSize: "13px", color: "#9896b8", lineHeight: 1.6, margin: 0,
      }}>
        {phase.blurb}
      </p>
    </div>
  );
}

/* ─── "Next Phase" divider ─── */
function NextPhaseDivider() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginTop: 28, marginBottom: 20, paddingRight: 28,
    }}>
      <div style={{ flex: 1, height: 1, background: "#d4cfea" }} />
      <span style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 700,
        fontSize: "10px", color: "#b8b4d0", letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}>
        Next Phase
      </span>
      <div style={{ flex: 1, height: 1, background: "#d4cfea" }} />
    </div>
  );
}

export function LearnScreen({
  progress,
  memory,
  onStartLesson,
  debugModeEnabled = false,
  onSetCompletedLessons,
}: LearnScreenProps) {
  void memory;
  const stage = clampCompletedLessons(progress.completedLessonIds.length);
  const mapSrc = MAP_STAGES[stage];
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeStickyPart, setActiveStickyPart] = useState<number>(1);
  const [flowStep, setFlowStep] = useState<"map" | "onboarding-preview">("map");
  const lesson = getCurrentLesson(progress);
  const previewBackgroundSrc = stage <= 2 ? lessonBgEarly : lessonBgLate;
  const lessonCharacterSrc = LESSON_P_IMAGES[lesson.level as keyof typeof LESSON_P_IMAGES] ?? lessonP1;
  const lessonSceneLabel = lesson.level <= 3 ? "Orientation chat" : "Alumni chat";
  const stickyTheme = STICKY_BANNER_THEMES[activeStickyPart] ?? STICKY_BANNER_THEMES[1];

  const syncStickyPartWithScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const pageHeight = Math.max(container.clientHeight * 0.8, 1);
    const pageIndex = Math.floor(container.scrollTop / pageHeight);
    const nextPart = Math.min(4, Math.max(1, pageIndex + 1));
    if (nextPart !== activeStickyPart) setActiveStickyPart(nextPart);
  };

  useEffect(() => {
    syncStickyPartWithScroll();
  }, []);

  const handleMapTap = () => {
    // Stage 5 is fully completed and only shows unlocked rewards on map.
    if (stage >= 5) return;
    setFlowStep("onboarding-preview");
  };

  if (flowStep === "onboarding-preview") {
    const UI = {
      headerTop: 56,
      headerLeft: 64,
      backTop: 52,
      backLeft: 16,
      characterTop: "50%",
      characterWidth: 200,
      taskCardTop: "62%",
      taskCardSide: 16,
      taskCardRadius: 18,
      taskCardPadding: "14px 14px 12px",
      titleSize: 26,
      titleMarginTop: 6,
      captionSize: 11,
      captionSpacing: "0.14em",
      sceneSpacing: "0.1em",
      taskBodySize: 18,
      hintSize: 12,
    } as const;

    const isFormalDialogueStage = false;
    const formalTopChipText = `· Level ${lesson.level} · ${lesson.title} ·`;
    const formalTaskChipText = `Challenge · ${lesson.shortTitle}`;
    const handleBack = () => {
      setFlowStep("map");
    };
    const handleTaskContinue = () => {
      onStartLesson(lesson.id);
    };

    return (
      <div style={{ height: "100%", background: "#f0ede8", display: "flex", flexDirection: "column", position: "relative" }}>
        <div
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <img
            src={previewBackgroundSrc}
            alt=""
            aria-hidden
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(84,70,178,0.7) 0%, rgba(84,70,178,0.36) 35%, rgba(240,237,232,0.92) 78%, #f0ede8 100%)",
            }}
          />

          <button
            type="button"
            onClick={handleBack}
            style={{
              position: "absolute",
              top: UI.backTop,
              left: UI.backLeft,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.84)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(20, 20, 80, 0.14)",
            }}
            aria-label="Back to map"
          >
            <ChevronLeft size={20} color="#1a1830" />
          </button>

          {isFormalDialogueStage ? (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 58,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 21,
                  fontFamily: "var(--font-heading)",
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: ".06em",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                {formalTopChipText}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 100,
                  left: 14,
                  zIndex: 21,
                  maxWidth: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 9px",
                    borderRadius: 10,
                    background: "rgba(107,99,212,0.45)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 6px 16px rgba(107,99,212,0.18)",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      flexShrink: 0,
                      background: "transparent",
                      border: "2px solid #FFFFFF",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.25,
                      color: "#FFFFFF",
                    }}
                  >
                    {formalTaskChipText}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", top: UI.headerTop, left: UI.headerLeft, right: 16 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: UI.captionSize,
                  letterSpacing: UI.captionSpacing,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {`Level ${lesson.level} Mission`}
              </div>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: UI.captionSize,
                  letterSpacing: UI.sceneSpacing,
                  textTransform: "uppercase",
                color: "#FFFFFF",
                  marginTop: 4,
                }}
              >
                {lessonSceneLabel}
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 600,
                  fontSize: UI.titleSize,
                  lineHeight: 1.12,
                  marginTop: UI.titleMarginTop,
                  color: "white",
                }}
              >
                {lesson.title}
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: UI.characterTop,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 8,
            }}
          >
            <img
              src={lessonCharacterSrc}
              alt="Main character"
              style={{
                width: UI.characterWidth,
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 24px rgba(40, 30, 110, 0.22))",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleTaskContinue}
            style={{
              position: "absolute",
              left: "50%",
              top: UI.taskCardTop,
              transform: "translate(-50%, -50%)",
              width: `calc(100% - ${UI.taskCardSide * 2}px)`,
              background: "rgba(255,255,255,0.94)",
              borderRadius: UI.taskCardRadius,
              padding: UI.taskCardPadding,
              boxShadow: "0 8px 24px rgba(20,20,80,0.15)",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              zIndex: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: UI.hintSize,
                color: "#6B63D4",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Target size={14} />
                {isFormalDialogueStage ? "Challenge" : "Task"}
              </span>
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: UI.captionSize,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                {lessonSceneLabel}
              </span>
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: UI.taskBodySize,
                color: "#1a1830",
                lineHeight: 1.25,
              }}
            >
              {lesson.userTask}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: UI.hintSize,
                color: "#9896b8",
                lineHeight: 1.45,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Sparkles size={13} />
              {lesson.supportLabel}
            </div>
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 96,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={handleTaskContinue}
            style={{
              width: "100%",
              height: 54,
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(180deg, #8C7BF5 0%, #6B63D4 100%)",
              color: "white",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(84,70,178,0.34)",
            }}
          >
            {isFormalDialogueStage ? "Finish this lesson" : "Start rehearsal"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "#f0ede8", display: "flex", flexDirection: "column" }}>

      {/* ── Stats bar (fixed) ── */}
      <div style={{ padding: "52px 16px 14px", flexShrink: 0 }}>
        <div style={{
          background: "white", borderRadius: 16, padding: "11px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <img src={s.img} alt="" aria-hidden style={{ width: 20, height: 20, objectFit: "contain" }} />
              <span style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
                fontSize: "14px", color: "#1a1830",
              }}>
                {s.value}
              </span>
              {i < STATS.length - 1 && (
                <div style={{ width: 1, height: 14, background: "#e0dced", marginLeft: 4 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll area: all 4 phases stacked vertically ── */}
      <div style={{
        flex: 1, overflowY: "auto", scrollbarWidth: "none",
        paddingLeft: 28, paddingTop: 4, paddingBottom: 110,
      } as React.CSSProperties} ref={scrollRef} onScroll={syncStickyPartWithScroll}>

        <ActivePhaseHeader
          partLabel={stickyTheme.partLabel}
          title={stickyTheme.title}
          background={stickyTheme.background}
          titleColor={stickyTheme.titleColor}
          subtitleColor={stickyTheme.subtitleColor}
          sticky
        />

        {debugModeEnabled && (
          <div
            style={{
              marginRight: 28,
              marginBottom: 12,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 12,
              padding: "10px 10px 8px",
              boxShadow: "0 4px 12px rgba(20,20,80,0.1)",
              border: "1px solid rgba(107,99,212,0.25)",
            }}
          >
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#6B63D4",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Debug Map Stage
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[0, 1, 2, 3, 4].map((value) => {
                const active = stage === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onSetCompletedLessons?.(value)}
                    style={{
                      width: 34,
                      height: 28,
                      borderRadius: 8,
                      border: active ? "none" : "1px solid rgba(107,99,212,0.35)",
                      background: active ? "#6B63D4" : "white",
                      color: active ? "white" : "#6B63D4",
                      fontFamily: "'Fredoka', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    aria-label={`Set map stage ${value}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {PHASES.map((phase, phaseIdx) => (
          <div key={phase.num}>
            {/* Separator before phases 2+ */}
            {phaseIdx > 0 && <NextPhaseDivider />}

            {phase.status === "active" ? (
              <>
                <button
                  type="button"
                  onClick={handleMapTap}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    marginRight: 28,
                    width: "calc(100% - 28px)",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={mapSrc}
                    alt={`Learning map stage ${stage}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 16,
                      boxShadow: "0 4px 14px rgba(20, 20, 80, 0.12)",
                    }}
                  />
                </button>
              </>
            ) : (
              <LockedPhaseCard phase={phase} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
