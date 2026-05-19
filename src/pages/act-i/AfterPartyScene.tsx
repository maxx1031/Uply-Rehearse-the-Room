import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic } from "lucide-react";
import sceneBg from "@/assets/after-party/scene-bg.jpg";
import sceneWithSilhouette from "@/assets/after-party/scene-with-silhouette.png";

interface Props {
  onMicTap?: () => void;
}

type Phase = "establish" | "character";

const ESTABLISH_MS = 2400;

export function AfterPartyScene({ onMicTap }: Props) {
  const [phase, setPhase] = useState<Phase>("establish");

  useEffect(() => {
    const t = setTimeout(() => setPhase("character"), ESTABLISH_MS);
    return () => clearTimeout(t);
  }, []);

  const characterShown = phase === "character";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "var(--bg-deep-night)",
        userSelect: "none",
      }}
    >
      {/* Background layer: crossfade scene-bg → scene-with-silhouette */}
      <AnimatePresence>
        <motion.img
          key={characterShown ? "character" : "establish"}
          src={characterShown ? sceneWithSilhouette : sceneBg}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>

      {/* Top banner */}
      <AnimatePresence>
        {characterShown && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              position: "absolute",
              top: 56,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(10px)",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: "var(--fs-micro)",
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "var(--text-ink)",
              boxShadow: "0 4px 16px rgba(40, 30, 110, 0.18)",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            · FINAL PRESENTATION AFTER PARTY ·
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-left: Add alumni on LinkedIn checkbox */}
      <AnimatePresence>
        {characterShown && (
          <motion.div
            key="linkedin-chip"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              position: "absolute",
              top: 110,
              left: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "var(--fs-caption)",
              fontWeight: 700,
              color: "var(--accent-purple-mid)",
              zIndex: 10,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: "2px solid var(--accent-purple-mid)",
                background: "rgba(255,255,255,0.85)",
                display: "inline-block",
              }}
            />
            Add alumni on LinkedIn
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat bubble — Maya's opening line */}
      <AnimatePresence>
        {characterShown && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.1 }}
            style={{
              position: "absolute",
              top: 168,
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 260,
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: 18,
              padding: "12px 16px",
              fontSize: 15,
              color: "var(--text-ink)",
              lineHeight: 1.4,
              boxShadow: "0 6px 20px rgba(40, 30, 110, 0.18)",
              zIndex: 10,
            }}
          >
            Hi, your presentation was great!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info card below silhouette */}
      <AnimatePresence>
        {characterShown && (
          <motion.div
            key="info-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.5 }}
            style={{
              position: "absolute",
              bottom: 220,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: 16,
              padding: "12px 18px",
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(40, 30, 110, 0.16)",
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                fontSize: "var(--fs-caption)",
                fontWeight: 800,
                color: "var(--accent-purple-mid)",
                letterSpacing: "0.02em",
              }}
            >
              Female Senior · Same Major
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-ink-mute)",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              Seen at the Library Before
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom: hint + mic */}
      <AnimatePresence>
        {characterShown && (
          <motion.div
            key="mic-area"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.9 }}
            style={{
              position: "absolute",
              bottom: 56,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: "var(--fs-caption)",
                color: "var(--text-on-dark)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                letterSpacing: "0.02em",
              }}
            >
              Want to say hi first?
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onMicTap}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "none",
                cursor: onMicTap ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 6px 24px rgba(40, 30, 110, 0.3), 0 0 0 6px rgba(255,255,255,0.25)",
              }}
              aria-label="Tap to talk"
            >
              <Mic size={26} color="var(--accent-purple-mid)" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft vignette so overlays read against bright scene */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(20, 14, 50, 0.35) 100%)",
          zIndex: 5,
        }}
      />
    </div>
  );
}
