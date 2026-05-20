import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import partyBg from "@/assets/after-party/party-bg.jpg";
import character from "@/assets/after-party/character.png";

interface Props {
  /** Auto-fires after the reveal sequence completes. */
  onDone?: () => void;
}

const MAYA_NAME = "Maya";
const SWAY_MS = 1450;   // background-only camera settle
const REVEAL_MS = 2700; // total before advancing to mission card

// S1_CHARACTER_REVEAL — sequence:
//   1) 拉幕后只有背景场景淡入 + 镜头"落定"摇晃 (双层视差映射, 此时主角还没出现)
//   2) 摇晃结束 → 主角 (透明 character) + 头顶名牌 同时淡入
//   3) 自动进入 S2 (conversation 的 mission 卡)
export function AfterPartyScene({ onDone }: Props) {
  const [revealed, setRevealed] = useState(false);

  // pointer position [-1,1]; springs smooth it
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 14, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 55, damping: 14, mass: 0.6 });

  // back layer shifts a little; front (character + name) shifts more → depth
  const bgX = useTransform(sx, [-1, 1], [14, -14]);
  const bgY = useTransform(sy, [-1, 1], [10, -10]);
  const chX = useTransform(sx, [-1, 1], [34, -34]);
  const chY = useTransform(sy, [-1, 1], [20, -20]);

  // entrance camera-settle sway (background only); reuses parallax mapping for depth
  useEffect(() => {
    const controls = animate(px, [0, 0.75, -0.65, 0.32, -0.16, 0], {
      duration: 1.4, ease: "easeInOut",
    });
    return () => controls.stop();
  }, [px]);

  // character + name appear together once the sway has settled
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), SWAY_MS);
    return () => clearTimeout(t);
  }, []);

  // ongoing micro-parallax (mouse + gyro) after the entrance
  useEffect(() => {
    let active = false;
    const startT = setTimeout(() => { active = true; }, SWAY_MS);
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

      {/* Front group — name tag + character, centered in the screen as one unit.
          motion handles parallax (whole near-layer moves together). Name sits a few px above the head. */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        x: chX, y: chY,
      }}>
        {/* Name tag — a few px above the character's head */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            marginBottom: -36,
            background: "#FFFFFF", borderRadius: 10, padding: "5px 12px",
            fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".18em",
            color: "var(--accent-purple-mid)",
            boxShadow: "0 4px 14px rgba(40,30,110,.2)",
            whiteSpace: "nowrap",
          }}
        >
          {MAYA_NAME.toUpperCase()}
        </motion.div>

        {/* Character (transparent), appears together with the name */}
        <motion.img
          src={character}
          alt=""
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={revealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "52%", width: "auto",
            filter: "drop-shadow(0 12px 28px rgba(40,30,110,0.35))",
          }}
        />
      </motion.div>
    </div>
  );
}
