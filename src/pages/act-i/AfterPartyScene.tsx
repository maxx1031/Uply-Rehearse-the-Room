import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import partyBg from "@/assets/after-party/party-bg.jpg";
import character from "@/assets/after-party/character.png";

interface Props {
  /** Auto-fires after the reveal + camera-settle sequence completes. */
  onDone?: () => void;
}

const MAYA_NAME = "Maya";
const REVEAL_MS = 2600;

// S1_CHARACTER_REVEAL — two-layer parallax for a VR/game camera feel.
//   背景层 (party-bg) 位移小, 主角层 (character) 位移大 → 纵深感.
//   入场: 拉幕后镜头"落定"摇晃 (两层不同幅度); 之后鼠标/陀螺仪持续微视差.
// 然后自动进入 S2 (conversation 的 mission 卡).
export function AfterPartyScene({ onDone }: Props) {
  // pointer position in [-1, 1]; springs smooth it out
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 14, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 55, damping: 14, mass: 0.6 });

  // back layer shifts a little; front (character) shifts more → parallax depth
  const bgX = useTransform(sx, [-1, 1], [14, -14]);
  const bgY = useTransform(sy, [-1, 1], [10, -10]);
  const chX = useTransform(sx, [-1, 1], [34, -34]);
  const chY = useTransform(sy, [-1, 1], [20, -20]);

  // entrance: drive px through a settle-sway; reuses the parallax mapping so it
  // inherently has depth. pointer/orientation listeners attach after it ends.
  useEffect(() => {
    const controls = animate(px, [0, 0.75, -0.65, 0.32, -0.16, 0], {
      duration: 1.4, ease: "easeInOut",
    });
    return () => controls.stop();
  }, [px]);

  useEffect(() => {
    let active = false;
    const startT = setTimeout(() => { active = true; }, 1400);

    const onMouse = (e: MouseEvent) => {
      if (!active) return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (!active) return;
      if (e.gamma != null) px.set(Math.max(-1, Math.min(1, e.gamma / 28)));
      if (e.beta != null)  py.set(Math.max(-1, Math.min(1, (e.beta - 45) / 28)));
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      clearTimeout(startT);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [px, py]);

  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, REVEAL_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      background: "var(--bg-deep-night)", userSelect: "none",
    }}>
      {/* Back layer — party scene (no main character), oversized so parallax never reveals edges */}
      <motion.img
        src={partyBg}
        alt=""
        initial={{ opacity: 0, scale: 1.18 }}
        animate={{ opacity: 1, scale: 1.14 }}
        transition={{ opacity: { duration: 0.6, ease: "easeOut" }, scale: { duration: 0.9, ease: "easeOut" } }}
        style={{
          position: "absolute", inset: "-8%",
          width: "116%", height: "116%", objectFit: "cover",
          x: bgX, y: bgY,
        }}
      />

      {/* Front layer — main character (transparent png), shifts more */}
      <motion.img
        src={character}
        alt=""
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "8%", left: "50%",
          height: "58%", width: "auto",
          translateX: "-50%",
          x: chX, y: chY,
          filter: "drop-shadow(0 12px 28px rgba(40,30,110,0.35))",
        }}
      />

      {/* Name tag — above the character's head */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        style={{
          position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
          borderRadius: 10, padding: "5px 12px",
          fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".18em",
          color: "var(--accent-purple-mid)",
          boxShadow: "0 4px 14px rgba(40,30,110,.2)",
          whiteSpace: "nowrap", zIndex: 5,
        }}
      >
        {MAYA_NAME.toUpperCase()}
      </motion.div>
    </div>
  );
}
