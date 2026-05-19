import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useRealtime } from "@/lib/useRealtime";

interface Props {
  userName?: string;
  onContinue?: () => void;
}

export function SceneScreen({ userName: _userName, onContinue }: Props) {
  const [showLabels, setShowLabels] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const rt = useRealtime({
    onSpeakingChange: setAiSpeaking,
  });

  const active = rt.status === "active";
  const connecting = rt.status === "requesting-token" || rt.status === "connecting";

  useEffect(() => {
    const t1 = setTimeout(() => setShowLabels(true), 800);
    const t2 = setTimeout(() => setShowVoice(true), 1600);
    // Auto-advance into the new Act I observe flow if onContinue is wired.
    const t3 = onContinue ? setTimeout(() => onContinue(), 4200) : null;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
    };
  }, [onContinue]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setWavePhase((p) => p + 1), 120);
    return () => clearInterval(interval);
  }, [active]);

  const handleMicTap = () => {
    if (active || connecting) {
      rt.stop();
    } else {
      rt.start();
    }
  };

  const hintText =
    rt.status === "error" ? (rt.error?.slice(0, 80) ?? "Something went wrong")
    : !rt.isAvailable ? "Voice mode unavailable (server not configured)"
    : active ? (aiSpeaking ? "Classmate is speaking…" : "Listening — say hi!")
    : connecting ? "Connecting to classmate…"
    : "Tap the mic to start the conversation";

  return (
    <div className="relative flex flex-col h-full overflow-hidden select-none" style={{ background: "#d4cfc8" }}>

      {/* ── School corridor scene ── */}
      <div className="absolute inset-0" style={{ perspective: "600px" }}>

        {/* Ceiling */}
        <div className="absolute top-0 left-0 right-0" style={{ height: "28%", background: "linear-gradient(180deg, #c8c4bc 0%, #bfbab2 100%)" }}>
          {/* Fluorescent light strips */}
          {[-1, 0, 1].map((i) => (
            <div key={i} className="absolute top-4" style={{
              left: `${50 + i * 28}%`, transform: "translateX(-50%)",
              width: 6, height: "60%",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 0 24px 8px rgba(255,255,240,0.5)",
              borderRadius: 3,
            }} />
          ))}
        </div>

        {/* Back wall */}
        <div className="absolute left-0 right-0" style={{ top: "28%", height: "36%", background: "linear-gradient(180deg, #e8e3db 0%, #ddd8d0 100%)" }}>
          {/* Lockers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="absolute top-4 bottom-4" style={{
              left: `${4 + i * 13.5}%`,
              width: "11%",
              background: "#c8c3bc",
              borderRadius: "4px 4px 0 0",
              border: "1px solid rgba(0,0,0,0.08)",
            }}>
              {/* Locker handle */}
              <div style={{ position: "absolute", top: "48%", left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#9a9590" }} />
            </div>
          ))}
        </div>

        {/* Floor */}
        <div className="absolute left-0 right-0 bottom-0" style={{ top: "64%", background: "linear-gradient(180deg, #ccc7bf 0%, #bfbab2 100%)" }}>
          {/* Floor tiles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute" style={{
              left: 0, right: 0,
              top: `${i * 17}%`,
              height: "1px",
              background: "rgba(0,0,0,0.06)",
            }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute top-0 bottom-0" style={{
              left: `${i * 12.5}%`,
              width: "1px",
              background: "rgba(0,0,0,0.05)",
            }} />
          ))}
        </div>

        {/* Drink station table (right side) */}
        <div className="absolute" style={{ right: "8%", top: "52%", width: "18%", height: "12%", background: "#bfbab2", borderRadius: "4px 4px 0 0", border: "1px solid rgba(0,0,0,0.08)" }}>
          {/* Cups / bottles */}
          <div style={{ position: "absolute", top: -12, left: "20%", width: 8, height: 14, background: "#9095c8", borderRadius: "2px 2px 0 0", opacity: 0.7 }} />
          <div style={{ position: "absolute", top: -10, left: "50%", width: 8, height: 12, background: "#c89090", borderRadius: "2px 2px 0 0", opacity: 0.7 }} />
        </div>

        {/* Camera subtle sway container */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: [0, 4, -4, 3, -3, 0], y: [0, 1, -1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── AI silhouette character ── */}
      <div className="absolute" style={{ bottom: "32%", left: "50%", transform: "translateX(-50%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ position: "relative" }}
        >
          {/* Aura glow */}
          <motion.div
            className="absolute"
            style={{
              inset: "-24px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168,155,240,0.25) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* SVG silhouette — blurry, gender-neutral, gentle smile */}
          <svg width="72" height="100" viewBox="0 0 72 100" fill="none" style={{ filter: "blur(2.5px)", opacity: 0.72 }}>
            {/* Head */}
            <ellipse cx="36" cy="24" rx="18" ry="20" fill="rgba(140,130,210,0.65)" />
            {/* Body */}
            <path d="M16 60 Q18 44 36 42 Q54 44 56 60 L58 98 Q36 104 14 98 Z" fill="rgba(120,110,190,0.55)" />
            {/* Gentle smile — just a soft curve */}
            <path d="M30 28 Q36 33 42 28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Eyes — soft dots */}
            <circle cx="30" cy="22" r="2" fill="rgba(255,255,255,0.5)" />
            <circle cx="42" cy="22" r="2" fill="rgba(255,255,255,0.5)" />
          </svg>

          {/* Floating label above character */}
          <AnimatePresence>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute"
                style={{ bottom: "108%", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
              >
                <div style={{
                  background: "rgba(107,99,212,0.85)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  backdropFilter: "blur(6px)",
                  letterSpacing: "0.04em",
                }}>
                  Classmate
                </div>
                {/* Arrow */}
                <div style={{
                  position: "absolute",
                  bottom: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid rgba(107,99,212,0.85)",
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Floating labels ── */}
      <AnimatePresence>
        {showLabels && (
          <>
            {/* Scene label — top left */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute"
              style={{ top: "13%", left: "5%" }}
            >
              <div style={{
                background: "rgba(255,255,255,0.82)",
                borderRadius: "12px",
                padding: "6px 12px",
                fontSize: "11px",
                color: "#5a5280",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                border: "1px solid rgba(107,99,212,0.15)",
              }}>
                🏫 School Activity
              </div>
            </motion.div>

            {/* Task label — top right */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute"
              style={{ top: "13%", right: "5%" }}
            >
              <div style={{
                background: "rgba(255,255,255,0.82)",
                borderRadius: "12px",
                padding: "6px 12px",
                fontSize: "11px",
                color: "#5a5280",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                border: "1px solid rgba(107,99,212,0.15)",
              }}>
                🔗 Add on LinkedIn
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Voice input bar ── */}
      <AnimatePresence>
        {showVoice && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0"
            style={{ padding: "0 20px 32px", zIndex: 20 }}
          >
            {/* Live transcript when AI is speaking */}
            <AnimatePresence>
              {active && rt.transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mb-2 mx-auto"
                  style={{
                    maxWidth: 320,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.92)",
                    lineHeight: 1.4,
                    background: "rgba(18,10,42,0.55)",
                    padding: "8px 14px",
                    borderRadius: "14px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {rt.transcript}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-3"
              style={{
                fontSize: "12px",
                color: rt.status === "error" ? "rgba(255,180,180,0.9)" : "rgba(255,255,255,0.6)",
                letterSpacing: "0.03em",
              }}
            >
              {hintText}
            </motion.p>

            {/* Waveform — pulses while AI is speaking */}
            <AnimatePresence>
              {active && aiSpeaking && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  className="flex items-center justify-center gap-1 mb-3"
                  style={{ height: 28 }}
                >
                  {Array.from({ length: 18 }).map((_, i) => {
                    const height = 4 + Math.abs(Math.sin((wavePhase + i) * 0.6)) * 20;
                    return (
                      <div key={i} style={{
                        width: 3,
                        height,
                        borderRadius: 2,
                        background: "rgba(168,155,240,0.9)",
                        transition: "height 0.1s ease",
                      }} />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mic button */}
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleMicTap}
                disabled={!rt.isAvailable && rt.status === "idle"}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: active
                    ? "linear-gradient(135deg, #7c73e6, #a89be0)"
                    : connecting
                    ? "rgba(124,115,230,0.45)"
                    : "rgba(255,255,255,0.18)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: active
                    ? "0 0 0 8px rgba(168,155,240,0.2), 0 8px 32px rgba(107,99,212,0.5)"
                    : "0 4px 20px rgba(0,0,0,0.2)",
                  cursor: rt.isAvailable ? "pointer" : "not-allowed",
                  opacity: rt.isAvailable ? 1 : 0.5,
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                {connecting
                  ? <Loader2 size={28} color="white" className="animate-spin" />
                  : active
                  ? <MicOff size={28} color="white" />
                  : <Mic size={28} color="white" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purple-black vignette around all edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 15,
          background: "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(18,10,42,0.55) 68%, rgba(10,5,28,0.88) 100%)",
        }}
      />

      {/* Status bar bg */}
      <div className="absolute top-0 left-0 right-0 h-12 z-10" style={{ background: "rgba(212,207,200,0.8)", backdropFilter: "blur(4px)" }} />

      {/* Continue → observe (Act I progression) — prominent so it can't be missed */}
      {onContinue && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow: [
              "0 0 0 0 rgba(168,155,240,0.6)",
              "0 0 0 14px rgba(168,155,240,0)",
              "0 0 0 0 rgba(168,155,240,0)",
            ],
          }}
          transition={{
            opacity: { delay: 1.2, duration: 0.5 },
            scale: { delay: 1.2, duration: 0.5, type: "spring", stiffness: 220, damping: 18 },
            boxShadow: { delay: 1.7, duration: 2.4, repeat: Infinity, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.94 }}
          onClick={onContinue}
          className="absolute z-30"
          style={{
            top: 18,
            right: 18,
            padding: "10px 18px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #8b7df0, #6b63d4)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            border: "2px solid rgba(255,255,255,0.4)",
            cursor: "pointer",
          }}
        >
          Continue onboarding ›
        </motion.button>
      )}
    </div>
  );
}
