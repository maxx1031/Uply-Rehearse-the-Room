import { ScrollText, Lock } from "lucide-react";
import statCalendar from "@/assets/imports/1.png";
import statSapphire from "@/assets/imports/2.png";
import statStar     from "@/assets/imports/3.png";
import statMask     from "@/assets/imports/4.png";
import { PROFILE_CONSTANTS } from "@/lib/profileConfig";
import map0 from "@/assets/Map/Map0.png";
import map1 from "@/assets/Map/Map 1.png";
import map2 from "@/assets/Map/Map 2.png";
import map3 from "@/assets/Map/Map 3.png";
import map4 from "@/assets/Map/Map 4.png";
import map5 from "@/assets/Map/Map 5.png";

interface LearnScreenProps {
  /** Tap map → App routes to MissionPage → PracticePage. */
  onStartLevel?: () => void;
  completedLessons?: number;
}

const STATS = [
  { img: statCalendar, value: PROFILE_CONSTANTS.homeActiveDays },
  { img: statSapphire, value: "Sapphire" },
  { img: statStar,     value: "14,000"   },
  { img: statMask,     value: "95min"    },
];
const MAP_STAGES = [map0, map1, map2, map3, map4, map5] as const;

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

/* ─── Active Phase header (purple banner, inline) ─── */
function ActivePhaseHeader({ phase }: { phase: Phase }) {
  return (
    <div style={{
      background: "#6B63D4", borderRadius: 16, padding: "13px 16px",
      marginRight: 28, marginBottom: 18,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 4px 18px rgba(107,99,212,0.32)",
    }}>
      <div>
        <div style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 600,
          fontSize: "11px", color: "rgba(255,255,255,0.62)", letterSpacing: "0.05em",
        }}>
          {phase.partLabel}
        </div>
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
          fontSize: "22px", color: "white", lineHeight: 1.15, marginTop: 2,
        }}>
          {phase.title}
        </div>
      </div>
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: "rgba(255,255,255,0.16)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ScrollText size={22} color="white" strokeWidth={1.8} />
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

export function LearnScreen({ onStartLevel, completedLessons = 0 }: LearnScreenProps = {}) {
  const stage = clampCompletedLessons(completedLessons ?? 0);
  const mapSrc = MAP_STAGES[stage];

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
      } as React.CSSProperties}>

        {PHASES.map((phase, phaseIdx) => (
          <div key={phase.num}>
            {/* Separator before phases 2+ */}
            {phaseIdx > 0 && <NextPhaseDivider />}

            {phase.status === "active" ? (
              <>
                <ActivePhaseHeader phase={phase} />
                <button
                  type="button"
                  onClick={onStartLevel}
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
