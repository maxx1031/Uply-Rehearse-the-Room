import { useEffect } from "react";
import { motion } from "motion/react";
import logo from "@/assets/imports/logo-2.png";

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f2ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.img
        src={logo}
        alt="UPLY"
        style={{ width: 160, height: "auto" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  );
}
