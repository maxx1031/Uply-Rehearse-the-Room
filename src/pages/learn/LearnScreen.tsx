import { useState, useRef, useEffect, useCallback } from "react";

const CARD_H = 188;
const STEP   = 116; // visible gap between stacked cards

const FOLDERS = [
  { title: "First Impression", sub: "Break the ice confidently",       emoji: "👋", color: "#6B63D4" },
  { title: "Coffee Chat",      sub: "Turn small talk into connections", emoji: "☕", color: "#F59E0B" },
  { title: "LinkedIn Connect", sub: "Craft the perfect follow-up",      emoji: "🔗", color: "#3B82F6" },
  { title: "The Ask",          sub: "Request help without pressure",    emoji: "🤲", color: "#10B981" },
  { title: "Cold Email",       sub: "Reach out to new contacts",        emoji: "📧", color: "#EC4899" },
  { title: "Alumni Network",   sub: "Leverage your school ties",        emoji: "🎓", color: "#8B5CF6" },
  { title: "Group Event",      sub: "Work the room effectively",        emoji: "🎪", color: "#F97316" },
];

const KEY_SCENES = [
  { emoji: "☕", label: "Café Meet",    bg: "#FEF3C7" },
  { emoji: "🤝", label: "Intro Chat",  bg: "#EDE9FE" },
  { emoji: "📧", label: "Cold Mail",   bg: "#DBEAFE" },
  { emoji: "🎤", label: "Pitch It",    bg: "#FCE7F3" },
  { emoji: "🏛️", label: "Campus Walk", bg: "#D1FAE5" },
  { emoji: "📱", label: "DM Drop",     bg: "#FEE2E2" },
  { emoji: "🌐", label: "LinkedIn",    bg: "#E0F2FE" },
];

export function LearnScreen() {
  const [activeIdx, setActiveIdx] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [padV, setPadV] = useState(160);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const pad = Math.max(40, (h - CARD_H) / 2);
    setPadV(pad);
    el.scrollTop = activeIdx * STEP;
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / STEP);
    setActiveIdx(Math.max(0, Math.min(idx, FOLDERS.length - 1)));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0ede8" }}>

      {/* ── Header ── */}
      <div style={{ padding: "52px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
          Your Progress
        </div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "22px", color: "#1a1830" }}>
          Learning Path
        </div>
      </div>

      {/* ── Folder stack (scrollable) ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "scroll", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div style={{ height: padV }} />

        {FOLDERS.map((f, i) => {
          const isLocked  = i > activeIdx;
          const isDone    = i < activeIdx;
          const isActive  = i === activeIdx;
          const zIdx      = FOLDERS.length - Math.abs(i - activeIdx);
          const overlap   = CARD_H - STEP;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                zIndex: zIdx,
                marginBottom: -overlap,
                padding: "0 16px",
              }}
            >
              {/* Folder tab */}
              <div style={{
                width: 68, height: 22,
                background: isLocked ? "#c4c0d0" : f.color,
                borderRadius: "8px 8px 0 0",
                marginLeft: 10,
                opacity: isLocked ? 0.5 : 1,
              }} />

              {/* Folder body */}
              <div style={{
                height: CARD_H,
                borderRadius: "0 16px 16px 16px",
                background: isLocked
                  ? "linear-gradient(145deg, #ccc 0%, #b8b4c4 100%)"
                  : isDone
                  ? `linear-gradient(145deg, ${f.color}bb 0%, ${f.color}99 100%)`
                  : `linear-gradient(145deg, ${f.color} 0%, ${f.color}cc 100%)`,
                boxShadow: isActive
                  ? `0 16px 44px ${f.color}55, 0 4px 16px rgba(0,0,0,0.14)`
                  : "0 4px 14px rgba(0,0,0,0.09)",
                padding: "18px 20px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "box-shadow 0.3s ease",
              }}>
                <div>
                  <div style={{ fontSize: 34, marginBottom: 10, filter: isLocked ? "grayscale(1)" : "none" }}>{f.emoji}</div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "21px", color: isLocked ? "rgba(80,75,100,0.7)" : "white", lineHeight: 1.2 }}>
                    {f.title}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "12px", color: isLocked ? "rgba(80,75,100,0.5)" : "rgba(255,255,255,0.78)", marginTop: 4 }}>
                    {f.sub}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "12px",
                    color: isLocked ? "rgba(80,75,100,0.45)" : "rgba(255,255,255,0.9)",
                  }}>
                    {isDone   && "✓  Completed"}
                    {isActive && "▶  Continue"}
                    {isLocked && "🔒  Locked"}
                  </div>

                  {/* Progress ring */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: isLocked ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15,
                  }}>
                    {isDone ? "✓" : isActive ? "▶" : "○"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ height: padV + (CARD_H - STEP) + 16 }} />
      </div>

      {/* ── Key Scenes shelf ── */}
      <div style={{ flexShrink: 0, paddingBottom: 96 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 10px" }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "17px", color: "#1a1830" }}>
            Key Scenes
          </span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "11px", color: "#6B63D4", cursor: "pointer" }}>
            See All
          </span>
        </div>

        <div style={{ overflowX: "scroll", scrollbarWidth: "none", display: "flex", gap: 10, paddingLeft: 16 } as React.CSSProperties}>
          {KEY_SCENES.map((s, i) => (
            <div key={i} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 68, height: 68,
                borderRadius: 16,
                background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
                boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
              }}>
                {s.emoji}
              </div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "10px", color: "#9896b8", textAlign: "center", lineHeight: 1.2, width: 68 }}>
                {s.label}
              </span>
            </div>
          ))}
          <div style={{ width: 16, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
