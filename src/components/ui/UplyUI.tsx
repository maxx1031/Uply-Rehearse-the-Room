/**
 * Uply Onboarding — Shared UI primitives.
 *
 * All components are zero-dep. They expect `./styles.css` to be imported once
 * at the app root for keyframe animations.
 */
import { CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────
// Uply mark (smiley orb logo)
// ─────────────────────────────────────────────────────────────
export function UplyMark({ size = 22, dark = false }: { size?: number; dark?: boolean }) {
  const bg = dark ? "var(--accent-purple-mid)" : "var(--bg-lavender-soft)";
  const fg = dark ? "var(--bg-lavender-soft)" : "var(--accent-purple-mid)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill={bg} />
      <circle cx="9" cy="10" r="1.3" fill={fg} />
      <circle cx="15" cy="10" r="1.3" fill={fg} />
      <path d="M8.5 13.5 Q12 16 15.5 13.5" stroke={fg} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────
export function PrimaryBtn({
  children, onClick, disabled, glow = true, style = {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  glow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", height: 54, borderRadius: 9999, border: "none",
        background: disabled ? "#3a3268" : "linear-gradient(180deg,var(--accent-purple-soft),#7a6ee0)",
        color: "var(--text-on-dark)", fontWeight: 700, fontSize: 17, letterSpacing: ".2px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : (glow
          ? "0 0 0 1px rgba(255,255,255,.12) inset, 0 12px 40px rgba(122,110,224,.45), 0 2px 0 rgba(255,255,255,.25) inset"
          : "none"),
        transition: "transform .15s ease",
        fontFamily: "inherit",
        ...style,
      }}
    >{children}</button>
  );
}

export function GhostBtn({
  children, onClick, style = {},
}: { children: React.ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: "none", color: "var(--accent-lavender)",
      fontSize: 15, fontWeight: 600, letterSpacing: ".3px", cursor: "pointer",
      padding: "12px 16px", fontFamily: "inherit", ...style,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Chip / pill
// ─────────────────────────────────────────────────────────────
export function Chip({
  children, dark = true, style = {}, onClick,
}: { children: React.ReactNode; dark?: boolean; style?: CSSProperties; onClick?: () => void }) {
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 9999,
      background: dark ? "rgba(15,8,50,.65)" : "rgba(255,255,255,.9)",
      color: dark ? "var(--bg-lavender-soft)" : "var(--text-ink)",
      border: dark ? "1px solid rgba(184,172,246,.2)" : "1px solid rgba(29,20,82,.08)",
      fontSize: "var(--fs-caption)", fontWeight: 600, letterSpacing: ".2px",
      backdropFilter: "blur(8px)",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Eyebrow label (ACT I · ENCOUNTER, etc.)
// ─────────────────────────────────────────────────────────────
export function ActLabel({
  children, color = "var(--text-ink-mute)",
}: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontSize: 12, letterSpacing: ".32em", fontWeight: 700,
      color, textTransform: "uppercase",
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Theater backdrop — dark gradient + optional spotlights
// ─────────────────────────────────────────────────────────────
export function StageBackdrop({
  children, lit = false, style = {},
}: { children?: React.ReactNode; lit?: boolean; style?: CSSProperties }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: lit
        ? "radial-gradient(80% 60% at 50% 30%,#3d2f9d 0%,var(--text-ink) 55%,#0a0726 100%)"
        : "radial-gradient(80% 50% at 50% 20%,#241a5a 0%,#15103d 60%,#080522 100%)",
      overflow: "hidden",
      ...style,
    }}>
      {lit && (
        <>
          <div style={{ position: "absolute", top: -40, left: "18%", width: 160, height: 520,
            background: "linear-gradient(180deg, rgba(255,247,214,.18), rgba(255,247,214,0) 70%)",
            transform: "rotate(-12deg)", filter: "blur(6px)", mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", top: -40, right: "18%", width: 160, height: 520,
            background: "linear-gradient(180deg, rgba(255,247,214,.18), rgba(255,247,214,0) 70%)",
            transform: "rotate(12deg)", filter: "blur(6px)", mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 240, height: 600,
            background: "radial-gradient(50% 50% at 50% 0%, rgba(255,247,214,.22), rgba(255,247,214,0) 70%)",
            mixBlendMode: "screen" }} />
        </>
      )}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 73) % 100}%`, top: `${(i * 41) % 100}%`,
          width: 2, height: 2, borderRadius: "50%",
          background: "rgba(255,255,255,.4)",
          opacity: .4 + (i % 3) * .15,
          animation: `uply-float ${4 + (i % 5)}s ease-in-out infinite`,
          animationDelay: `${i * .3}s`,
        }} />
      ))}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Soft glowing figure (used in dark-stage scenes)
// ─────────────────────────────────────────────────────────────
export function GlowFigure({
  size = 200, color = "#7a6ee0", smile = true, blur = 22,
}: { size?: number; color?: string; smile?: boolean; blur?: number }) {
  return (
    <div style={{
      width: size, height: size * 1.3, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "uply-float 6s ease-in-out infinite",
    }}>
      <div style={{
        position: "absolute", inset: "-15%", borderRadius: "50%",
        background: `radial-gradient(circle, ${color}55 0%, ${color}11 50%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }} />
      <div style={{
        position: "absolute", top: "8%",
        width: size * .38, height: size * .38, borderRadius: "50%",
        background: color, filter: `blur(${blur * .4}px)`, opacity: .85,
      }} />
      <div style={{
        position: "absolute", bottom: "12%",
        width: size * .5, height: size * .55, borderRadius: `${size * .2}px ${size * .2}px 6px 6px`,
        background: color, filter: `blur(${blur * .5}px)`, opacity: .85,
      }} />
      {smile && (
        <svg width={size * .22} height={size * .16} viewBox="0 0 40 28" style={{
          position: "absolute", top: size * .18, zIndex: 2, opacity: .55,
        }}>
          <circle cx="13" cy="10" r="2" fill="var(--bg-lavender-soft)" />
          <circle cx="27" cy="10" r="2" fill="var(--bg-lavender-soft)" />
          <path d="M12 18 Q20 24 28 18" stroke="var(--bg-lavender-soft)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Solid figure (used in illustrated After-Party scene)
// ─────────────────────────────────────────────────────────────
export function SolidFigure({
  size = 180, color = "var(--accent-purple-mid)",
}: { size?: number; color?: string }) {
  const w = size, h = size * 1.15;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{
        position: "absolute", inset: "-10%",
        background: `radial-gradient(50% 50% at 50% 60%, ${color}33, transparent 70%)`,
        filter: "blur(18px)",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: w * .42, height: w * .42, borderRadius: "50%",
        background: color, boxShadow: `0 6px 20px ${color}55`,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: w * .7, height: h * .6,
        background: color,
        borderRadius: `${w * .5}px ${w * .5}px ${w * .05}px ${w * .05}px`,
        boxShadow: `0 8px 24px ${color}55`,
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Speech bubble (NPC dialog)
// ─────────────────────────────────────────────────────────────
export function SpeechBubble({
  children, tail = "bottom-left", style = {},
}: { children: React.ReactNode; tail?: "bottom-left" | "bottom-right" | "top-left"; style?: CSSProperties }) {
  const tails: Record<string, CSSProperties> = {
    "bottom-left":  { bottom: -8, left: 28 },
    "bottom-right": { bottom: -8, right: 28 },
    "top-left":     { top: -8, left: 28, transform: "rotate(180deg)" },
  };
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: 280, ...style }}>
      <div style={{
        background: "var(--text-on-dark)", color: "var(--text-ink)",
        padding: "14px 18px", borderRadius: 18,
        fontSize: 17, lineHeight: 1.35, fontWeight: 500,
        boxShadow: "0 8px 24px rgba(8,4,40,.25)",
      }}>{children}</div>
      <svg width="22" height="14" viewBox="0 0 22 14" style={{ position: "absolute", ...tails[tail] }}>
        <path d="M0 0 L22 0 L11 14 Z" fill="var(--text-on-dark)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mic button with optional pulsing rings (recording state)
// ─────────────────────────────────────────────────────────────
export function MicButton({
  active, onClick, size = 96,
}: { active?: boolean; onClick?: () => void; size?: number }) {
  return (
    <div style={{ position: "relative", width: size * 2.4, height: size * 2.4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {active && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: "1.5px solid rgba(184,172,246,.5)",
          animation: `uply-ripple 2.4s linear ${i * .8}s infinite`,
        }} />
      ))}
      {!active && [1.4, 1.8, 2.2].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: size * s, height: size * s, borderRadius: "50%",
          border: "1px solid rgba(184,172,246,.12)",
        }} />
      ))}
      <button onClick={onClick} style={{
        width: size, height: size, borderRadius: "50%", border: "none",
        background: active
          ? "radial-gradient(circle at 30% 30%,#c3b9f5,#7a6ee0 70%)"
          : "radial-gradient(circle at 30% 30%,var(--accent-lavender),#7a6ee0 70%)",
        boxShadow: "0 0 0 6px rgba(184,172,246,.18), 0 8px 30px rgba(122,110,224,.55), inset 0 -4px 12px rgba(29,20,82,.3), inset 0 2px 0 rgba(255,255,255,.4)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1,
      }}>
        <svg width={size * .4} height={size * .4} viewBox="0 0 24 24" fill="var(--text-on-dark)">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M7 11a5 5 0 0010 0" stroke="var(--text-on-dark)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12" y2="20" stroke="var(--text-on-dark)" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="20" x2="15" y2="20" stroke="var(--text-on-dark)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function TypingDots({ color = "var(--accent-lavender)" }: { color?: string }) {
  return (
    <div style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: `uply-typing 1.2s ease-in-out ${i * .18}s infinite`,
        }} />
      ))}
    </div>
  );
}
