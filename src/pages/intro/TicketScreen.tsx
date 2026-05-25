import { useState } from "react";
import { motion } from "motion/react";
import bgTexture from "@/assets/imports/___-1.jpg";
import theaterBg from "@/assets/imports/theater.jpg";
import uplyIcon from "@/assets/imports/logo3-1.png";

interface Props {
  onClaim: (name: string) => void;
  onLogin: () => void;
}

// Semicircular scallop mask — bites into top and bottom edges only
const SCALLOP_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle at 50% 0%, transparent 6px, black 6px), radial-gradient(circle at 50% 100%, transparent 6px, black 6px)",
  WebkitMaskSize: "20px 100%, 20px 100%",
  WebkitMaskRepeat: "repeat-x, repeat-x",
  WebkitMaskComposite: "source-in" as any,
  maskImage:
    "radial-gradient(circle at 50% 0%, transparent 6px, black 6px), radial-gradient(circle at 50% 100%, transparent 6px, black 6px)",
  maskSize: "20px 100%, 20px 100%",
  maskRepeat: "repeat-x, repeat-x",
  maskComposite: "intersect" as any,
};

export function TicketScreen({ onClaim, onLogin }: Props) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);

  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")} / ${String(
    today.getDate()
  ).padStart(2, "0")} / ${today.getFullYear()}`;

  const handleClaim = () => {
    if (!contact.trim() || !password.trim() || !name.trim()) return;
    setClaiming(true);
    setTimeout(() => onClaim(name.trim()), 900);
  };

  const ready =
    contact.trim().length > 0 &&
    password.trim().length > 0 &&
    name.trim().length > 0;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <img src={bgTexture} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "rgba(245,242,238,0.45)" }} />

      <div className="h-12" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={
            claiming
              ? { opacity: 0, y: 80, scale: 0.94 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={
            claiming
              ? { duration: 0.5, ease: "easeIn" }
              : { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
          }
          className="w-full"
          style={{ maxWidth: 340 }}
        >
          {/* ── Drop-shadow wrapper (must be outside clip-path) ── */}
          <div
            style={{
              filter:
                "drop-shadow(0 2px 0 rgba(80,60,180,0.10)) drop-shadow(0 12px 28px rgba(60,50,140,0.22)) drop-shadow(0 28px 48px rgba(0,0,0,0.10))",
            }}
          >
            {/* ── Ticket (scalloped top + bottom edges) ── */}
            <div style={{ background: "white", ...SCALLOP_MASK }}>

              {/* Theater image header */}
              <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                <img
                  src={theaterBg}
                  alt=""
                  aria-hidden
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(60,50,140,0.35) 0%, rgba(40,30,110,0.72) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "18px 22px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={uplyIcon} alt="" aria-hidden style={{ height: 22, width: "auto" }} />
                    <span style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "0.14em", fontWeight: 600 }}>
                      UPLY THEATER
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.75)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
                    Now Showing
                  </div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "26px", fontWeight: 500, color: "white", lineHeight: 1.2, letterSpacing: "-0.3px" }}>
                    First Encounter
                  </div>
                </div>
              </div>

              {/* Perforated tear */}
              <div className="relative flex items-center" style={{ background: "white" }}>
                <div style={{ width: 20, height: 20, background: "#f0ede9", borderRadius: "0 50% 50% 0", flexShrink: 0, marginLeft: -1 }} />
                <div style={{ flex: 1, borderTop: "2px dashed rgba(107,99,212,0.2)", margin: "0 4px" }} />
                <div style={{ width: 20, height: 20, background: "#f0ede9", borderRadius: "50% 0 0 50%", flexShrink: 0, marginRight: -1 }} />
              </div>

              {/* Ticket body */}
              <div style={{ padding: "18px 22px 28px" }}>
                {/* Date */}
                <div className="flex justify-between items-center mb-5">
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#b0aed4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Date</span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "13px", color: "#6B63D4", fontWeight: 600 }}>{dateStr}</span>
                </div>

                {/* Phone or Email */}
                <div className="mb-3">
                  <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", display: "block", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    placeholder="your@email.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full outline-none"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, background: "#f7f5f2", border: "1.5px solid rgba(107,99,212,0.15)", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#1a1830" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6B63D4")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(107,99,212,0.15)")}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", display: "block", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, background: "#f7f5f2", border: "1.5px solid rgba(107,99,212,0.15)", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#1a1830" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6B63D4")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(107,99,212,0.15)")}
                  />
                </div>

                {/* Your Name */}
                <div className="mb-7">
                  <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", display: "block", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="What should we call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full outline-none"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, background: "#f7f5f2", border: "1.5px solid rgba(107,99,212,0.15)", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#1a1830" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6B63D4")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(107,99,212,0.15)")}
                  />
                </div>

                {/* ── Raised CTA button ── */}
                <button
                  onClick={handleClaim}
                  disabled={!ready}
                  onPointerDown={() => ready && setBtnPressed(true)}
                  onPointerUp={() => setBtnPressed(false)}
                  onPointerLeave={() => setBtnPressed(false)}
                  className="w-full py-3.5 rounded-2xl text-white"
                  style={{
                    background: ready
                      ? "linear-gradient(180deg, #7c73e6 0%, #5b52cc 100%)"
                      : "rgba(107,99,212,0.18)",
                    color: ready ? "white" : "#b0aed4",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: ready ? "pointer" : "default",
                    transform: ready && btnPressed ? "translateY(4px)" : "translateY(0)",
                    boxShadow: !ready
                      ? "none"
                      : btnPressed
                      ? "0 1px 0 #3d36a0, 0 4px 12px rgba(107,99,212,0.2)"
                      : "0 5px 0 #3d36a0, 0 8px 24px rgba(107,99,212,0.38)",
                    transition: "transform 0.08s ease, box-shadow 0.08s ease",
                  }}
                >
                  {claiming ? "Getting your seat…" : "Claim My Ticket"}
                </button>
              </div>
            </div>
          </div>

          {/* Log in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-5"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "12px", color: "#9896b8" }}
          >
            Already an actor?{" "}
            <span className="underline cursor-pointer" style={{ color: "#6B63D4" }} onClick={onLogin}>
              Log in directly
            </span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
