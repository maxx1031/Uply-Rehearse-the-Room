import { useState } from "react";
import { Plus, Mic, ArrowUp, Clock } from "lucide-react";
import bg55 from "@/assets/imports/55.png";
import megaphone from "@/assets/imports/you2.png";

// Single source of truth for the page's brand purple. Used by the input
// frame, dividers and any other accent. Keeps the screen visually unified.
const BRAND_PURPLE = "#5b52cc";

function HistoryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="History"
      style={{
        position: "absolute", top: 52, right: 20, zIndex: 30,
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Clock size={17} color="white" strokeWidth={2} />
    </button>
  );
}

export function ReviewScreen() {
  const [text, setText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#f0ede8",
        overflowY: "auto",
        scrollbarWidth: "none",
      } as React.CSSProperties}
    >
      <HistoryButton onClick={() => setShowHistory(true)} />
      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          style={{
            position: "absolute", inset: 0, zIndex: 40,
            background: "rgba(20,15,60,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ color: "white", fontFamily: "'Fredoka', sans-serif", fontSize: 18 }}>
            History (stub — tap to close)
          </div>
        </div>
      )}
      {/* ── Hero: studio illustration, deeper purple mood + bottom gradient ── */}
      <div style={{
        height: "34vh",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}>
        <img
          src={bg55}
          alt=""
          aria-hidden
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            display: "block",
          }}
        />
        {/* Top purple gradient — mid depth, unified with Profile hero */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "78%",
          background: "linear-gradient(180deg, #5b52cc 0%, rgba(91,82,204,0.92) 30%, rgba(124,115,230,0.55) 65%, rgba(124,115,230,0.22) 88%, rgba(107,99,212,0) 100%)",
          pointerEvents: "none",
        }} />
        {/* Bottom atmosphere — cinematic depth */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(40,30,110,0) 50%, rgba(40,30,110,0.22) 100%)",
          pointerEvents: "none",
        }} />
        {/* Bottom gradient fade into page bg, for smooth hand-off */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 56,
          background: "linear-gradient(to bottom, rgba(240,237,232,0) 0%, #f0ede8 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Input card: thick purple frame, taller body, yellow submit ── */}
      <div style={{ margin: "0 16px", marginTop: -132, position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div style={{
          borderRadius: 32,
          background: BRAND_PURPLE,
          padding: "14px 14px 4px",
          boxShadow: "0 10px 32px rgba(60,40,180,0.30)",
        }}>
          {/* Inner white area — slightly lighter, still spacious */}
          <div style={{
            borderRadius: 22,
            background: "white",
            padding: "16px 16px 12px",
            display: "flex",
            flexDirection: "column",
            minHeight: 174,
          }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Describe your scenario or conversation."
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "#1a1830",
                background: "transparent",
                lineHeight: 1.6,
                minHeight: 128,
              }}
            />
            {/* Helper buttons row — left + right (icons unchanged size) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
              <button style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#eeecf8", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={14} color={BRAND_PURPLE} strokeWidth={2} />
              </button>
              <button style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#eeecf8", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Mic size={14} color={BRAND_PURPLE} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Pagination dots — three dots on each side, sits in the purple frame */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 18px 12px",
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Yellow submit (arrow up) — floats centered, straddles bottom edge */}
        <button style={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: 54, height: 54, borderRadius: "50%",
          background: "#FFCF4A",
          border: "3px solid #f0ede8",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(255,180,0,0.45), 0 2px 4px rgba(60,40,180,0.18)",
        }}>
          <ArrowUp size={22} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Performance Review — compact section label, fills card width-ish ── */}
      <div style={{
        margin: "28px 24px 18px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <div style={{ flex: "0 0 48px", height: 6, borderRadius: 999, background: "#9B94E6" }} />
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "15px",
          color: "#8F8ADF", whiteSpace: "nowrap", letterSpacing: "1.5px", lineHeight: 1,
        }}>Performance Review</div>
        <div style={{ flex: "0 0 48px", height: 6, borderRadius: 999, background: "#9B94E6" }} />
      </div>

      {/* ── Empty scene cards grid (future content) ── */}
      <div style={{ padding: "0 16px", minHeight: 120, flexShrink: 0 }} />

      {/* ── Megaphone module — yellow rounded bubble with megaphone head on right ── */}
      <div style={{
        marginTop: "auto",
        padding: "24px 16px 130px",
        flexShrink: 0,
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Yellow bubble — matches home page Luna bubble */}
          <div style={{ flex: 1, position: "relative", marginLeft: 44 }}>
            <div style={{
              background: "#FFCF4A",
              borderRadius: 18,
              padding: "13px 16px",
            }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: "15px", color: "#2a1f0e", lineHeight: 1.45 }}>
                You're not "being fake", you're prepping!
              </div>
            </div>
            {/* Tail pointing right toward megaphone */}
            <div style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0, height: 0,
              borderTop: "9px solid transparent",
              borderBottom: "9px solid transparent",
              borderLeft: "11px solid #FFCF4A",
            }} />
          </div>
          {/* Megaphone head — same size as home avatar */}
          <img
            src={megaphone}
            alt=""
            aria-hidden
            style={{ width: 76, height: 76, objectFit: "contain", flexShrink: 0, display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
