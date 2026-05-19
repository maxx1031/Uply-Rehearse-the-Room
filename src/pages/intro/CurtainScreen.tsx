import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onDone: () => void;
}

export function CurtainScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"closed" | "opening" | "lit" | "done">("closed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 300);
    // Curtain fully open → lights start coming up
    const t2 = setTimeout(() => setPhase("lit"), 3000);
    // Transition out
    const t3 = setTimeout(() => setPhase("done"), 4200);
    const t4 = setTimeout(onDone, 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  const isOpen = phase === "opening" || phase === "lit" || phase === "done";
  const isLit = phase === "lit" || phase === "done";

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: "#050310" }}>

      {/* ── Stage behind the curtain ── */}
      <div className="absolute inset-0">
        {/* Deep dark back wall */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #04020f 0%, #0a0520 60%, #060310 100%)" }} />

        {/* Warm light flooding down from above — house lights coming up */}
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "70%",
            background: "linear-gradient(180deg, rgba(255,220,140,0.0) 0%, transparent 100%)",
          }}
          animate={{
            background: isLit
              ? "linear-gradient(180deg, rgba(255,215,120,0.55) 0%, rgba(255,190,80,0.18) 50%, transparent 100%)"
              : "linear-gradient(180deg, rgba(255,220,140,0.0) 0%, transparent 100%)",
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Center stage spotlight — expands as lights come on */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "15%",
            width: 320,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,230,160,0.0) 0%, transparent 70%)",
          }}
          animate={{
            background: isLit
              ? "radial-gradient(ellipse, rgba(255,235,170,0.38) 0%, rgba(255,210,100,0.12) 50%, transparent 70%)"
              : isOpen
              ? "radial-gradient(ellipse, rgba(255,230,160,0.06) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(255,230,160,0.0) 0%, transparent 70%)",
            scale: isLit ? 1.4 : isOpen ? 0.9 : 0.5,
          }}
          transition={{ duration: isLit ? 2.0 : 1.6, ease: "easeOut" }}
        />

        {/* Side stage lights — amber wash from wings */}
        <motion.div
          className="absolute top-0 bottom-0 left-0"
          style={{ width: "40%", background: "linear-gradient(90deg, rgba(255,180,60,0.0), transparent)" }}
          animate={{ background: isLit ? "linear-gradient(90deg, rgba(255,180,60,0.14), transparent)" : "linear-gradient(90deg, rgba(255,180,60,0.0), transparent)" }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 bottom-0 right-0"
          style={{ width: "40%", background: "linear-gradient(270deg, rgba(255,180,60,0.0), transparent)" }}
          animate={{ background: isLit ? "linear-gradient(270deg, rgba(255,180,60,0.14), transparent)" : "linear-gradient(270deg, rgba(255,180,60,0.0), transparent)" }}
          transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
        />

        {/* Stage floor — reflects warm light */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "36%", background: "linear-gradient(180deg, #06031a 0%, #04020e 100%)" }}
          animate={{
            background: isLit
              ? "linear-gradient(180deg, rgba(30,18,60,1) 0%, rgba(18,10,40,1) 100%)"
              : "linear-gradient(180deg, #06031a 0%, #04020e 100%)",
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* Floor reflection glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "20%", background: "transparent" }}
          animate={{
            background: isLit
              ? "linear-gradient(0deg, rgba(255,200,80,0.08) 0%, transparent 100%)"
              : "transparent",
          }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />

        {/* Footlights strip */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ bottom: "34%", height: 3, borderRadius: 2 }}
          animate={{
            background: isLit
              ? "linear-gradient(90deg, transparent, rgba(255,210,100,0.6), rgba(255,230,150,0.9), rgba(255,210,100,0.6), transparent)"
              : isOpen
              ? "linear-gradient(90deg, transparent, rgba(107,99,212,0.3), rgba(130,120,220,0.5), rgba(107,99,212,0.3), transparent)"
              : "transparent",
            boxShadow: isLit
              ? "0 0 18px 8px rgba(255,210,100,0.25)"
              : isOpen
              ? "0 0 12px 4px rgba(107,99,212,0.2)"
              : "none",
          }}
          transition={{ duration: 1.4, delay: isLit ? 0.2 : 0.5, ease: "easeOut" }}
        />
      </div>

      {/* ── Left curtain ── */}
      <motion.div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: "55%",
          background: "linear-gradient(90deg, #2a1260 0%, #4a2f96 60%, #6b50c0 100%)",
          zIndex: 10,
          boxShadow: "inset -24px 0 48px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "-88%" : 0 }}
        transition={{ duration: 2.3, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {[12, 24, 38, 52, 66, 80].map((pct) => (
          <div key={pct} className="absolute top-0 bottom-0" style={{ left: `${pct}%`, width: "1.5px", background: "rgba(0,0,0,0.25)" }} />
        ))}
        <div className="absolute top-0 bottom-0 right-0" style={{ width: "28%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07))" }} />
        {/* Curtain velvet sheen */}
        <div className="absolute top-0 bottom-0 left-0" style={{ width: "15%", background: "linear-gradient(90deg, rgba(0,0,0,0.3), transparent)" }} />
      </motion.div>

      {/* ── Right curtain ── */}
      <motion.div
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: "55%",
          background: "linear-gradient(270deg, #2a1260 0%, #4a2f96 60%, #6b50c0 100%)",
          zIndex: 10,
          boxShadow: "inset 24px 0 48px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "88%" : 0 }}
        transition={{ duration: 2.3, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {[18, 32, 45, 58, 72, 85].map((pct) => (
          <div key={pct} className="absolute top-0 bottom-0" style={{ left: `${pct}%`, width: "1.5px", background: "rgba(0,0,0,0.25)" }} />
        ))}
        <div className="absolute top-0 bottom-0 left-0" style={{ width: "28%", background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.07))" }} />
        <div className="absolute top-0 bottom-0 right-0" style={{ width: "15%", background: "linear-gradient(270deg, rgba(0,0,0,0.3), transparent)" }} />
      </motion.div>

      {/* Curtain top valance */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{
          height: 58,
          background: "linear-gradient(180deg, #1a0a48 0%, #2e1870 100%)",
          boxShadow: "0 6px 28px rgba(0,0,0,0.7)",
        }}
      />

      {/* ── 4 footlights in a centre row ── */}
      <div className="absolute z-20" style={{ bottom: "34%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isLit ? 1 : isOpen ? 0.15 : 0,
              boxShadow: isLit
                ? "0 0 0 3px rgba(255,220,80,0.25), 0 0 18px 10px rgba(255,200,60,0.45), 0 0 40px 20px rgba(255,180,40,0.2)"
                : "none",
            }}
            transition={{ duration: 1.2, delay: isLit ? 0.15 * i : 0.8 + 0.1 * i, ease: "easeOut" }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: isLit
                ? "radial-gradient(circle, #fff7d0 20%, #f5c842 70%, #e8a820 100%)"
                : "radial-gradient(circle, #9090b8 30%, #404060 100%)",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Warm light flood — final transition out */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "linear-gradient(180deg, rgba(255,230,160,0.95) 0%, rgba(255,245,220,1) 100%)" }}
            transition={{ duration: 0.55, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
