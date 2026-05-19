/**
 * Uply Onboarding — INTERLUDE screens
 *
 * Flow:
 *   LinkedInScreen → AnalyzingScreen     (loading)
 *                  → ResultScreen        (archetype reveal)
 *                  → ReflectionScreen    (does this match how you show up?)
 *
 * Customize ARCHETYPES + bucket feedback at the top of this file.
 */
import { useEffect, useState } from "react";
import { StageBackdrop, ActLabel, PrimaryBtn, UplyMark } from "@/components/ui/UplyUI";

// ─────────────────────────────────────────────────────────────
// Tunables — swap copy to fit your final taxonomy
// ─────────────────────────────────────────────────────────────
export type ArchetypeId =
  | "quiet-observer" | "active-connector" | "sincere-speaker"
  | "relationship-builder" | "confident-influencer";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  edges: string[];
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  "quiet-observer": {
    id: "quiet-observer",
    name: "The Quiet Observer",
    emoji: "🌙",
    tagline: "You watch the room before you join it.",
    description:
      "You waited, mirrored Maya's tone, and only stepped forward when it felt safe. That care is a strength — but the spotlight is also yours to take.",
    strengths: ["Reads emotional cues", "Steady, not rushed", "Sincere when it matters"],
    edges:     ["Could open up faster", "Steers away from spotlight", "Holds back specifics"],
  },
  "active-connector": {
    id: "active-connector",
    name: "The Active Connector",
    emoji: "⚡",
    tagline: "You move toward people first.",
    description:
      "You stepped forward early and kept the energy flowing. Pair that warmth with deeper questions next time.",
    strengths: ["Opens the door", "Keeps momentum", "Generous with attention"],
    edges:     ["Can over-talk", "Skim past depth", "Forget to leave silence"],
  },
  "sincere-speaker": {
    id: "sincere-speaker",
    name: "The Sincere Speaker",
    emoji: "🌿",
    tagline: "You tell the truth, even when it's softer than the room.",
    description:
      "Your answers came from a real place — no performance. That's rare. Try practicing landing a confident first line.",
    strengths: ["Authentic", "Listens without performing", "Trusted easily"],
    edges:     ["Slow to open", "Sometimes apologetic", "Holds back asks"],
  },
  "relationship-builder": {
    id: "relationship-builder",
    name: "The Relationship Builder",
    emoji: "🪡",
    tagline: "You think in arcs, not moments.",
    description:
      "You closed the loop — exchanging contacts, leaving a thread to pull next time. That's a designer's instinct.",
    strengths: ["Long-game thinker", "Curates a real network", "Follows up"],
    edges:     ["Can over-plan", "Misses spontaneous moments", "Sometimes too formal"],
  },
  "confident-influencer": {
    id: "confident-influencer",
    name: "The Confident Influencer",
    emoji: "🌟",
    tagline: "You take the stage and bring people with you.",
    description:
      "You owned the moment — Maya followed your lead. Watch that the room doesn't only follow; let them shape it too.",
    strengths: ["Strong first impression", "Drives the conversation", "Energy in the room"],
    edges:     ["Can dominate airtime", "Skim over others' bids", "Resist quieter moments"],
  },
};

// ╔══════════════════════════════════════════════════════════════════════
// ║  AnalyzingScreen — loading interlude, 4 staged ticks
// ╚══════════════════════════════════════════════════════════════════════
export function AnalyzingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const stages = [
    "Reading the room...",
    "Listening to your delivery...",
    "Picking up on your rhythm...",
    "Casting your stage role...",
  ];
  useEffect(() => {
    const id = setInterval(() => setStep(s => s + 1), 900);
    const done = setTimeout(() => onDone(), 4200);
    return () => { clearInterval(id); clearTimeout(done); };
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StageBackdrop>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "40px 30px",
        }}>
          <ActLabel color="#b8acf6">INTERLUDE</ActLabel>
          <div className="uply-serif" style={{
            color: "#ebe6fb", fontSize: 30, fontWeight: 600, lineHeight: 1.2,
            textAlign: "center", marginTop: 14, maxWidth: 320,
          }}>Reviewing the tape...</div>

          <div style={{ position: "relative", width: 200, height: 200, marginTop: 40 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(184,172,246,.25)", animation: "uply-spin 8s linear infinite" }}>
              {[0, 90, 180, 270].map(a => (
                <div key={a} style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 6, height: 6, marginLeft: -3, marginTop: -3,
                  background: "#b8acf6", borderRadius: "50%",
                  transform: `rotate(${a}deg) translate(98px)`,
                  boxShadow: "0 0 12px #b8acf6",
                }} />
              ))}
            </div>
            <div style={{ position: "absolute", inset: "8%", borderRadius: "50%",
              border: "1px dashed rgba(184,172,246,.4)",
              animation: "uply-spin 12s linear infinite reverse" }} />
            <div style={{
              position: "absolute", inset: "18%", borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #9c8ff0, #5a4ad9)",
              boxShadow: "0 0 40px rgba(184,172,246,.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "uply-glow-pulse 2.4s ease-in-out infinite",
            }}>
              <UplyMark size={48} />
            </div>
          </div>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
            {stages.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                opacity: i <= step ? 1 : .3, transition: "opacity .4s ease",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: i < step ? "#9c8ff0" : "transparent",
                  border: "1.5px solid #9c8ff0",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {i < step && <svg width="9" height="9" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {i === step && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#b8acf6", animation: "uply-flicker .8s ease-in-out infinite" }} />}
                </div>
                <div style={{ color: i <= step ? "#ebe6fb" : "#5d567f", fontSize: 14, fontWeight: 500 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </StageBackdrop>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  ResultScreen — archetype reveal (staggered card cascade)
// ║  Pass `archetypeId` to drive the content. Defaults to "quiet-observer".
// ╚══════════════════════════════════════════════════════════════════════
export function ResultScreen({
  archetypeId = "quiet-observer", onContinue,
}: { archetypeId?: ArchetypeId; onContinue: () => void }) {
  const A = ARCHETYPES[archetypeId];
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const ids = [200, 500, 900, 1300, 1700].map((d, i) => setTimeout(() => setRevealed(i + 1), d));
    return () => ids.forEach(clearTimeout);
  }, []);
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "auto",
      background: "linear-gradient(180deg, #f6f2e9 0%, #ebe5d7 100%)",
      padding: "70px 22px 32px",
    }}>
      <div className="uply-fade-up" style={{ textAlign: "center", marginBottom: 18 }}>
        <ActLabel>YOUR STAGE ROLE</ActLabel>
        <div style={{ fontSize: 48, marginTop: 6 }}>{A.emoji}</div>
        <div className="uply-serif" style={{ fontSize: 34, fontWeight: 700, color: "#1d1452", lineHeight: 1.05, marginTop: 4 }}>
          {A.name}
        </div>
        <div style={{ fontSize: 14, color: "#5d567f", fontStyle: "italic", marginTop: 8, padding: "0 20px" }}>
          "{A.tagline}"
        </div>
      </div>

      {revealed >= 1 && (
        <div className="uply-fade-up" style={{
          background: "#fefcf6", borderRadius: 18, padding: "16px 18px",
          boxShadow: "0 8px 24px rgba(8,4,40,.08)", marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, color: "#1d1452", lineHeight: 1.5 }}>{A.description}</div>
        </div>
      )}

      {revealed >= 2 && (
        <div className="uply-fade-up" style={{
          background: "#fefcf6", borderRadius: 18, padding: "16px 18px", marginBottom: 12,
          boxShadow: "0 8px 24px rgba(8,4,40,.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".28em", color: "#5a4ad9" }}>WHAT YOU DID WELL</div>
          </div>
          {A.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", color: "#1d1452", fontSize: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5a4ad9" }} />
              {s}
            </div>
          ))}
        </div>
      )}

      {revealed >= 3 && (
        <div className="uply-fade-up" style={{
          background: "#fefcf6", borderRadius: 18, padding: "16px 18px", marginBottom: 18,
          boxShadow: "0 8px 24px rgba(8,4,40,.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".28em", color: "#b9802c" }}>YOUR GROWTH EDGES</div>
          </div>
          {A.edges.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", color: "#1d1452", fontSize: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d39a3a" }} />
              {s}
            </div>
          ))}
        </div>
      )}

      {revealed >= 4 && (
        <div className="uply-fade-up">
          <PrimaryBtn onClick={onContinue}>This feels right →</PrimaryBtn>
        </div>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  ReflectionScreen — "Does this reflect how you actually show up?"
// ║  Slider with three feedback buckets (left / mid / right).
// ╚══════════════════════════════════════════════════════════════════════
export type ReflectionBucket = "left" | "mid" | "right";

export function ReflectionScreen({
  onContinue,
}: { onContinue: (bucket: ReflectionBucket) => void }) {
  const [val, setVal] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  const bucket: ReflectionBucket = val < 33 ? "left" : val > 66 ? "right" : "mid";
  const feedback: Record<ReflectionBucket, { title: string; body: string }> = {
    left:  { title: "Good news — we already know each other a little 🎯", body: "What you played on stage tonight maps closely to how you usually show up. We'll build from here." },
    mid:   { title: "Somewhere between rehearsal and reality 🪞", body: "Some of this is you; some is the version you wish were you. We'll work in that gap — it's the most useful place to practice." },
    right: { title: "Then there's so much to discover ✨", body: "What we saw tonight isn't the whole you. The coming scenes will give you space to try on other voices." },
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StageBackdrop>
        <div style={{
          position: "absolute", inset: 0, padding: "70px 24px 40px",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}>
          <ActLabel color="#8881b8">DIRECTOR'S NOTE</ActLabel>
          <div className="uply-serif" style={{ color: "#ebe6fb", fontSize: 28, fontWeight: 600, lineHeight: 1.2, marginTop: 10 }}>
            Does this reflect how you actually show up?
          </div>
          <div style={{ color: "#8881b8", fontSize: 14, marginTop: 8 }}>
            Drag the marker — there's no wrong answer.
          </div>

          <div style={{ marginTop: 42, position: "relative" }}>
            <div style={{
              height: 8, borderRadius: 9999,
              background: "linear-gradient(90deg, #f3d27e 0%, #b8acf6 50%, #5a4ad9 100%)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,.3)",
            }} />
            <input type="range" min={0} max={100} value={val}
              onChange={e => setVal(+e.target.value)} disabled={submitted}
              style={{ position: "absolute", top: -12, left: 0, width: "100%", height: 32, opacity: 0, cursor: "pointer" }} />
            <div style={{
              position: "absolute", top: -8, left: `${val}%`, transform: "translateX(-50%)",
              width: 24, height: 24, borderRadius: "50%",
              background: "#fff", boxShadow: "0 4px 14px rgba(184,172,246,.6), 0 0 0 2px #5a4ad9",
              transition: submitted ? "left .4s ease" : "none", pointerEvents: "none",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18,
              fontSize: 11, fontWeight: 700, letterSpacing: ".22em", color: "#8881b8" }}>
              <span>NOT AT ALL</span><span>SOMEWHERE BETWEEN</span><span>EXACTLY ME</span>
            </div>
          </div>

          {submitted ? (
            <div className="uply-fade-up" style={{
              marginTop: 32, padding: "18px 18px",
              background: "rgba(255,255,255,.06)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(184,172,246,.2)",
              borderRadius: 18, color: "#ebe6fb",
            }}>
              <div className="uply-serif" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, marginBottom: 8 }}>
                {feedback[bucket].title}
              </div>
              <div style={{ fontSize: 14, color: "#d8d0f9", lineHeight: 1.5 }}>{feedback[bucket].body}</div>
            </div>
          ) : <div style={{ flex: 1 }} />}

          <div style={{ marginTop: 24, paddingBottom: 8 }}>
            {submitted
              ? <PrimaryBtn onClick={() => onContinue(bucket)}>Continue →</PrimaryBtn>
              : <PrimaryBtn onClick={() => setSubmitted(true)}>Submit my read</PrimaryBtn>}
          </div>
        </div>
      </StageBackdrop>
    </div>
  );
}
