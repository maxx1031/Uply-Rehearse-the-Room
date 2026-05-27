import { ScrollText, Lock } from "lucide-react";
import statCalendar from "@/assets/imports/1.png";
import statSapphire from "@/assets/imports/2.png";
import statStar     from "@/assets/imports/3.png";
import statMask     from "@/assets/imports/4.png";
import propDoc      from "@/assets/imports/7.png";  // 文档: 写自我介绍
import propEnvelope from "@/assets/imports/5.png";  // 信封: 发出去
import propCoffee   from "@/assets/imports/6.png";  // 咖啡: 见面聊

interface LearnScreenProps {
  /** Tap any non-locked frame → App routes to MissionPage → PracticePage. */
  onStartLevel?: () => void;
}

const STATS = [
  { img: statCalendar, value: "36 days"  },
  { img: statSapphire, value: "Sapphire" },
  { img: statStar,     value: "14,000"   },
  { img: statMask,     value: "95min"    },
];

/* ─── Film strip palette (flat solid purple, per reference image 2) ── */
const STRIP_C  = "#5249cc";
const ACTIVE_C = "#b8d147";   // lime green for "current" frame
// All non-active frames render as solid white (matches reference image 1 —
// done vs locked is behavior, not color).
const FRAME_WHITE = "#ffffff";

/* ─── Body sizing ────────────────────────────────────────────── */
const FW   = 60;     // white frame width
const FH   = 72;     // white frame height
const FGAP = 10;     // gap between frames
const SW   = 84;     // strip body total width (frame + side sprocket tracks)
const VPAD = 10;     // body inner top/bottom padding
const HW   = 7;      // sprocket hole width
const HH   = 9;      // sprocket hole height
const HR   = 1.2;    // sprocket hole corner radius

/* ─── Curl sizing — L-shape hook, flat single color ─────────── */
const CT    = 60;    // curl thickness (= frame width, narrower than body)
const ARM_E = 56;    // arm extends right past leg's right edge
const LEG_E = 22;    // leg extends below arm bottom (gives the hook its "drop")
const TIP_R = 10;    // rounded tip radius
const INR   = 4;     // inner concave corner radius
const OUTR  = 4;     // other outer corners
const CURL_OVERLAP = 1; // 1px overlap into body to hide seam

const CURL_OFFSET_X = (SW - CT) / 2;  // center curl on body
const CURL_W = CT + ARM_E;            // total curl width
const CURL_H = CT + LEG_E;            // total curl height

type LevelStatus = "done" | "active" | "locked";
interface Level { status: LevelStatus }

// Phase 1 · Part 1 — Self Introduction.
// 4 段胶片 (3 个工具图标分隔), 围绕 CS master 找 RA 语境的"自我介绍"渐进梯度:
//   Segment 1 (5): observe / warm-up
//   ✒️ pen
//   Segment 2 (5): write your intro — first frame active
//   ✂️ scissors
//   Segment 3 (4): edit / refine
//   🎤 mic
//   Segment 4 (5): speak it out
//
// 进度规则: 前 5 个完成 → segment 2 第 1 帧 active → 后续全部 locked
const SEGMENT_SIZES = [5, 5, 4, 5] as const;
const ACTIVE_FLAT_INDEX = 5; // global index across all segments

function buildLevels(): Level[][] {
  let idx = 0;
  return SEGMENT_SIZES.map((n) =>
    Array.from({ length: n }, () => {
      const status: LevelStatus =
        idx < ACTIVE_FLAT_INDEX ? "done" :
        idx === ACTIVE_FLAT_INDEX ? "active" : "locked";
      idx += 1;
      return { status };
    })
  );
}

const SEGMENTS = buildLevels();

// 4 段胶片之间穿插 3 个紫色道具 (来自 art-assets/UI icon, 已 mirror 到 src/assets/imports):
//   Segment 1 (observe) → 📄 写自我介绍 → Segment 2 (write)
//                       → ✉️ 发出去      → Segment 3 (send/edit)
//                       → ☕ 见面聊       → Segment 4 (speak)
const DIVIDER_IMAGES = [propDoc, propEnvelope, propCoffee];

/* ───────────────────────────────────────────────────────────────
 * SVG path helpers for L-shaped curls (per reference image 2).
 *
 * Curl bounding box: CURL_W × CURL_H
 *   - Vertical leg: x = [0, CT], y = [0, CT + LEG_E]
 *   - Horizontal arm: x = [0, CT + ARM_E], y = [0, CT]
 *   - Tip (right end): rounded by TIP_R
 *   - Inner concave corner (arm meets leg): rounded by INR
 *   - Outer corners (attachment side): small radius OUTR
 * ─────────────────────────────────────────────────────────────── */
function topCurlPath(): string {
  const W = CURL_W;
  const H = CURL_H;
  return [
    `M ${OUTR} 0`,
    `L ${W - TIP_R} 0`,
    `A ${TIP_R} ${TIP_R} 0 0 1 ${W} ${TIP_R}`,
    `L ${W} ${CT - TIP_R}`,
    `A ${TIP_R} ${TIP_R} 0 0 1 ${W - TIP_R} ${CT}`,
    `L ${CT + INR} ${CT}`,
    `A ${INR} ${INR} 0 0 0 ${CT} ${CT + INR}`,
    `L ${CT} ${H}`,
    `L 0 ${H}`,
    `L 0 ${OUTR}`,
    `A ${OUTR} ${OUTR} 0 0 1 ${OUTR} 0`,
    `Z`,
  ].join(" ");
}

function bottomCurlPath(): string {
  const W = CURL_W;
  const H = CURL_H;
  // Mirror of top curl across horizontal axis; attachment line at y=0.
  return [
    `M ${OUTR} ${H}`,
    `L ${W - TIP_R} ${H}`,
    `A ${TIP_R} ${TIP_R} 0 0 0 ${W} ${H - TIP_R}`,
    `L ${W} ${LEG_E + TIP_R}`,
    `A ${TIP_R} ${TIP_R} 0 0 0 ${W - TIP_R} ${LEG_E}`,
    `L ${CT + INR} ${LEG_E}`,
    `A ${INR} ${INR} 0 0 1 ${CT} ${LEG_E - INR}`,
    `L ${CT} 0`,
    `L 0 0`,
    `L 0 ${H - OUTR}`,
    `A ${OUTR} ${OUTR} 0 0 0 ${OUTR} ${H}`,
    `Z`,
  ].join(" ");
}

const TOP_CURL_D = topCurlPath();
const BOTTOM_CURL_D = bottomCurlPath();

/* ─── A single film strip segment, rendered as one SVG ───────── */
function FilmSegment({ frames, onTap }: { frames: Level[]; onTap?: () => void }) {
  const bodyH = frames.length * (FH + FGAP) - FGAP + VPAD * 2;
  const inset = (SW - FW) / 2;

  // Sprocket holes: 2 per frame slot (top + bottom of each frame), aligned.
  const holeCount = frames.length * 2;
  const holeStride = (bodyH - VPAD - HH) / Math.max(1, holeCount - 1);

  // Total SVG size: body + curl arm extending right + curls above/below
  const totalW = SW + ARM_E + CURL_OFFSET_X;
  const visibleCurlH = CURL_H - CURL_OVERLAP;
  const totalH = visibleCurlH + bodyH + visibleCurlH;
  const bodyY = visibleCurlH;
  const bottomCurlY = bodyY + bodyH - CURL_OVERLAP;
  const leftHoleX = (inset - HW) / 2;
  const rightHoleX = SW - inset + (inset - HW) / 2;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Top curl */}
      <g transform={`translate(${CURL_OFFSET_X}, 0)`}>
        <path d={TOP_CURL_D} fill={STRIP_C} />
      </g>

      {/* Body rectangle */}
      <rect x={0} y={bodyY} width={SW} height={bodyH} fill={STRIP_C} />

      {/* Sprocket holes (left + right columns) */}
      {Array.from({ length: holeCount }).map((_, i) => {
        const hy = bodyY + VPAD / 2 + i * holeStride;
        return (
          <g key={`h-${i}`}>
            <rect x={leftHoleX}  y={hy} width={HW} height={HH} rx={HR} fill="rgba(255,255,255,0.92)" />
            <rect x={rightHoleX} y={hy} width={HW} height={HH} rx={HR} fill="rgba(255,255,255,0.92)" />
          </g>
        );
      })}

      {/* Level frames (clickable) */}
      {frames.map((f, i) => {
        const fy = bodyY + VPAD + i * (FH + FGAP);
        const locked = f.status === "locked";
        const active = f.status === "active";
        const fill = active ? ACTIVE_C : FRAME_WHITE;
        return (
          <g key={i}>
            {active && (
              <rect
                x={inset - 2}
                y={fy - 2}
                width={FW + 4}
                height={FH + 4}
                rx={5}
                fill="none"
                stroke="rgba(184,209,71,0.55)"
                strokeWidth={1.5}
              />
            )}
            <rect
              x={inset}
              y={fy}
              width={FW}
              height={FH}
              rx={3}
              fill={fill}
              onClick={locked ? undefined : onTap}
              style={{
                cursor: locked ? "not-allowed" : "pointer",
                pointerEvents: locked ? "none" : "auto",
              }}
              role="button"
              aria-label={`Level (${f.status})`}
            />
          </g>
        );
      })}

      {/* Bottom curl */}
      <g transform={`translate(${CURL_OFFSET_X}, ${bottomCurlY})`}>
        <path d={BOTTOM_CURL_D} fill={STRIP_C} />
      </g>
    </svg>
  );
}

/* ─── Decorative purple-themed prop between film segments ─── */
function Divider({ img, tilt }: { img: string; tilt: number }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: "8px 0 12px",
      paddingRight: 40,  // 让道具略偏左, 与左侧胶片节奏对齐
    }}>
      <img
        src={img}
        alt=""
        aria-hidden
        style={{
          width: 64, height: 64, objectFit: "contain",
          transform: `rotate(${tilt}deg)`,
          filter: "drop-shadow(0 4px 8px rgba(40,30,110,0.18))",
        }}
      />
    </div>
  );
}

// 每个道具略微倾斜, 制造手绘随性感
const DIVIDER_TILTS = [-8, 6, -4];

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

export function LearnScreen({ onStartLevel }: LearnScreenProps = {}) {
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
                {SEGMENTS.map((frames, segIdx) => (
                  <div key={segIdx}>
                    <FilmSegment frames={frames} onTap={onStartLevel} />
                    {segIdx < SEGMENTS.length - 1 && (
                      <Divider img={DIVIDER_IMAGES[segIdx]} tilt={DIVIDER_TILTS[segIdx]} />
                    )}
                  </div>
                ))}
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
