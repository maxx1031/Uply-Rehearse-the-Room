import { useMemo } from "react";
import { motion } from "motion/react";
import theaterBg from "@/assets/imports/theater.jpg";
import uplyIcon from "@/assets/imports/logo3-1.png";

interface Props {
  userName: string;
  showTitle: string;
  exiting: boolean;
}

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

function FakeQRCode({ seed }: { seed: string }) {
  const grid = useMemo(() => {
    const size = 21;
    let h = 5381;
    for (let i = 0; i < seed.length; i++) {
      h = ((h << 5) + h) ^ seed.charCodeAt(i);
      h = h >>> 0;
    }
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => {
        if ((r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)) {
          const ir = r < 7 ? r : r - (size - 7);
          const ic = c < 7 ? c : c - (size - 7);
          if (ir === 0 || ir === 6 || ic === 0 || ic === 6) return true;
          if (ir >= 2 && ir <= 4 && ic >= 2 && ic <= 4) return true;
          return false;
        }
        if (r === 6 || c === 6) return (r + c) % 2 === 0;
        h ^= (h << 13); h ^= (h >> 7); h ^= (h << 17); h = h >>> 0;
        return h % 3 !== 0;
      })
    );
  }, [seed]);

  const cellPx = 3.5;
  const totalPx = 21 * cellPx;

  return (
    <svg width={totalPx} height={totalPx} viewBox={`0 0 ${totalPx} ${totalPx}`}>
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellPx}
              y={r * cellPx}
              width={cellPx}
              height={cellPx}
              fill="var(--text-accent)"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function TicketConfirmOverlay({ userName, showTitle, exiting }: Props) {
  const { rowLetter, seat } = useMemo(() => {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    return {
      rowLetter: letters[Math.floor(Math.random() * letters.length)],
      seat: Math.floor(Math.random() * 99) + 1,
    };
  }, []);

  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")} / ${String(
    today.getDate()
  ).padStart(2, "0")} / ${today.getFullYear()}`;

  const qrSeed = `${userName}-${showTitle}-${rowLetter}-${seat}`;

  return (
    <motion.div
      key="ticket-overlay"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Confirmed badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -20 : 0 }}
        transition={{ duration: exiting ? 0.3 : 0.4, delay: exiting ? 0 : 0.25 }}
        className="flex justify-center mb-4"
      >
        <div style={{
          background: "linear-gradient(135deg, var(--text-accent), #9b93ef)",
          borderRadius: 20,
          padding: "5px 16px",
          fontSize: "var(--fs-micro)",
          fontWeight: 700,
          color: "white",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          boxShadow: "0 4px 16px rgba(107,99,212,0.5)",
        }}>
          ✓ Ticket Confirmed
        </div>
      </motion.div>

      {/* Ticket */}
      <motion.div
        style={{ width: "100%", maxWidth: 340 }}
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={
          exiting
            ? { opacity: 0, y: 340, scale: 0.88, rotate: -4 }
            : { opacity: 1, y: 0, scale: 1, rotate: 0 }
        }
        transition={
          exiting
            ? { duration: 0.75, ease: [0.4, 0, 0.8, 0.6] }
            : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
        }
      >
        {/* Drop shadow */}
        <div style={{
          filter:
            "drop-shadow(0 2px 0 rgba(80,60,180,0.12)) drop-shadow(0 16px 36px rgba(60,50,140,0.35)) drop-shadow(0 36px 64px rgba(0,0,0,0.22))",
        }}>
          <div style={{ background: "white", ...SCALLOP_MASK }}>

            {/* Theater header */}
            <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
              <img
                src={theaterBg}
                alt=""
                aria-hidden
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(60,50,140,0.35) 0%, rgba(40,30,110,0.78) 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end", padding: "16px 22px",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <img src={uplyIcon} alt="" aria-hidden style={{ height: 22, width: "auto" }} />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "var(--fs-micro)", letterSpacing: "0.14em", fontWeight: 600 }}>
                    UPLY THEATER
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-micro)", fontWeight: 600, color: "rgba(255,255,255,0.72)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 }}>
                  Now Showing
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                  {showTitle}
                </div>
              </div>
            </div>

            {/* Perforated tear */}
            <div className="relative flex items-center" style={{ background: "white" }}>
              <div style={{ width: 20, height: 20, background: "var(--bg-paper)", borderRadius: "0 50% 50% 0", flexShrink: 0, marginLeft: -1 }} />
              <div style={{ flex: 1, borderTop: "2px dashed rgba(107,99,212,0.2)", margin: "0 4px" }} />
              <div style={{ width: 20, height: 20, background: "var(--bg-paper)", borderRadius: "50% 0 0 50%", flexShrink: 0, marginRight: -1 }} />
            </div>

            {/* Ticket body */}
            <div style={{ padding: "16px 22px 24px" }}>
              {/* Name */}
              <div className="mb-5">
                <div style={{ fontSize: "10px", color: "#b0aed4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
                  Ticket Holder
                </div>
                <div style={{ fontSize: "var(--fs-h2)", fontWeight: 600, color: "var(--bg-deep-night)", fontFamily: "var(--font-heading)" }}>
                  {userName || "Member"}
                </div>
              </div>

              {/* Seat info + QR code */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-6">
                  <div>
                    <div style={{ fontSize: "10px", color: "#b0aed4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                      Row
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-accent)" }}>
                      {rowLetter}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#b0aed4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                      Seat
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-accent)" }}>
                      {String(seat).padStart(2, "0")}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#b0aed4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                      Date
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#5a5280", marginTop: 2 }}>
                      {dateStr}
                    </div>
                  </div>
                </div>

                {/* QR code */}
                <div style={{
                  background: "#f5f3ff",
                  border: "1.5px solid rgba(107,99,212,0.18)",
                  borderRadius: 8,
                  padding: 6,
                  flexShrink: 0,
                }}>
                  <FakeQRCode seed={qrSeed} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
