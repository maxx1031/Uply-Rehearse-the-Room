import { motion } from "motion/react";
import { Settings, Shirt, ChevronRight, ChevronLeft } from "lucide-react";
import bgTexture from "@/assets/imports/___-1.jpg";
import characterImg from "@/assets/imports/wo-1.png";
import badge1 from "@/assets/imports/1.jpg";
import badge2 from "@/assets/imports/2.jpg";
import badge3 from "@/assets/imports/3.jpg";
import badge4 from "@/assets/imports/4.jpg";
import badge5 from "@/assets/imports/5.jpg";
import badge6 from "@/assets/imports/6.jpg";
import badge7 from "@/assets/imports/7.jpg";
import badge8 from "@/assets/imports/8.jpg";
import castAvatar1 from "@/assets/imports/1-1.png";
import castAvatar2 from "@/assets/imports/2-1.png";
import castAvatar3 from "@/assets/imports/3-1.png";
import castAvatar4 from "@/assets/imports/4-1.png";
import castAvatar5 from "@/assets/imports/5-1.png";
import castAvatar6 from "@/assets/imports/6-1.png";
import castAvatar7 from "@/assets/imports/7-1.png";
import castAvatar8 from "@/assets/imports/8.png";
import castAvatar9 from "@/assets/imports/9.png";
import castAvatar10 from "@/assets/imports/10.png";
import statCalendar from "@/assets/imports/1.png";
import statSapphire from "@/assets/imports/2.png";
import statStar from "@/assets/imports/3.png";
import statMask from "@/assets/imports/4.png";
import goalEmail from "@/assets/imports/5.png";
import goalCoffee from "@/assets/imports/6.png";
import goalResume from "@/assets/imports/7.png";

const WEEKLY_GOALS = [
  { img: goalEmail,  label: "Send Emails",       current: 3, total: 3 },
  { img: goalCoffee, label: "Have Coffee Chats", current: 0, total: 1 },
  { img: goalResume, label: "Send Resumes",      current: 1, total: 3 },
];

const BADGE_IMAGES = [badge1, badge6, badge7, badge8, badge5, badge2, badge3, badge4];
const BADGES_PREVIEW = Array.from({ length: 8 }, (_, i) => ({
  id: i, img: BADGE_IMAGES[i], unlocked: i < 5,
}));

const CAST_LABELS = [
  "Emma K.","Alex T.","Jordan M.","Sam R.","Casey L.",
  "Riley P.","Morgan S.","Drew H.","Taylor B.","Quinn N.",
];
const CAST_AVATARS = [
  castAvatar1, castAvatar2, castAvatar3, castAvatar4, castAvatar5,
  castAvatar6, castAvatar7, castAvatar8, castAvatar9, castAvatar10,
];

const STAT_ICONS = [statCalendar, statSapphire, statStar, statMask];
const STATS = [
  { value: "128 days" },
  { value: "Sapphire" },
  { value: "14,000"   },
  { value: "95min"    },
];

function daysLeftInWeek() {
  const day = new Date().getDay(); // 0=Sun … 6=Sat
  return day === 0 ? 7 : 7 - day;
}

interface Props {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: Props) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: "#f0ede8" }}>
      <img src={bgTexture} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-60" />

      <div className="relative flex-1 overflow-y-auto" style={{ paddingBottom: 80, scrollbarWidth: "none" }}>

        {/* ── Hero ── */}
        <div className="relative">
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 220,
            background: "linear-gradient(180deg, #5b52cc 0%, #7c73e6 55%, rgba(107,99,212,0) 100%)",
            zIndex: 0,
          }} />

          {/* Top bar */}
          <div className="relative flex items-center justify-between" style={{ padding: "52px 20px 0", zIndex: 1 }}>
            <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
              <ChevronLeft size={17} color="white" />
            </button>
            <div className="flex gap-2">
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
                <Shirt size={17} color="white" />
              </button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
                <Settings size={17} color="white" />
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center" style={{ paddingTop: 18, position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 160, height: 160, borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img src={characterImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 600, color: "#1a1830", marginTop: 12 }}>
              Max
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "12px", color: "#9896b8", marginTop: 2 }}>
              Actor since 2024
            </div>
          </div>
        </div>

        {/* ── Stats 2×2 grid ── */}
        <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto", rowGap: 10, columnGap: 32 }}>
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={STAT_ICONS[i]} alt="" aria-hidden style={{ width: 20, height: 20, objectFit: "contain" }} />
                </div>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600, color: "#1a1830" }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Weekly Little Wins ── */}
        <div style={{ padding: "24px 16px 0" }}>
          <div style={{ background: "rgba(180,175,210,0.13)", borderRadius: 18, padding: "16px 14px" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600, color: "#1a1830" }}>
              Weekly Little Wins
            </span>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 13 }}>🕐</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "#9896b8" }}>
                {daysLeftInWeek()} days left
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {WEEKLY_GOALS.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Left: label + pill progress bar */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "#1a1830", marginBottom: 8 }}>
                    {g.label}
                  </div>
                  <div style={{ position: "relative", height: 20, background: "#e8e5f0", borderRadius: 20, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(g.current / g.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                      style={{
                        position: "absolute", top: 0, left: 0, bottom: 0,
                        background: "linear-gradient(90deg, #7c73e6, #6B63D4)",
                        borderRadius: 20,
                      }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-heading)", fontSize: "13px", fontWeight: 600,
                      color: g.current === g.total ? "white" : "#9896b8",
                    }}>
                      {g.current} / {g.total}
                    </div>
                  </div>
                </div>

                {/* Right: icon */}
                <img src={g.img} alt="" aria-hidden style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
          </div>
        </div>

        {/* ── Badges (2 rows × 4) ── */}
        <div style={{ padding: "24px 16px 0" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600, color: "#1a1830" }}>
              Achievement Badges
            </span>
            <button style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#6B63D4", fontWeight: 600 }}>
                All 66
              </span>
              <ChevronRight size={14} color="#6B63D4" />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {BADGES_PREVIEW.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  aspectRatio: "1",
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  filter: badge.unlocked ? "none" : "grayscale(1) opacity(0.35)",
                  boxShadow: badge.unlocked
                    ? "0 4px 0 rgba(0,0,0,0.12), 0 6px 16px rgba(0,0,0,0.1)"
                    : "none",
                }}
              >
                <img
                  src={badge.img}
                  alt=""
                  aria-hidden
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Cast ── */}
        <div style={{ padding: "24px 16px 0" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 600, color: "#1a1830" }}>
              Cast
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#6B63D4", fontWeight: 600, cursor: "pointer" }}>
              See All
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px 8px" }}>
            {CAST_LABELS.slice(0, 10).map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex flex-col items-center"
              >
                <div style={{ width: 58, height: 58, borderRadius: "50%", overflow: "hidden" }}>
                  <img src={CAST_AVATARS[i]} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "10px", color: "#9896b8", marginTop: 5, textAlign: "center", lineHeight: 1.2 }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
