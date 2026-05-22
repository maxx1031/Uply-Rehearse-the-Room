/**
 * Uply Onboarding — INTERLUDE screens
 *
 * Flow:
 *   ConversationScreen → AnalyzingScreen (loading)
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
          <ActLabel color="var(--accent-lavender)">INTERLUDE</ActLabel>
          <div className="uply-serif" style={{
            color: "var(--bg-lavender-soft)", fontSize: 30, fontWeight: 600, lineHeight: 1.2,
            textAlign: "center", marginTop: 14, maxWidth: 320,
          }}>Reviewing the tape...</div>

          <div style={{ position: "relative", width: 200, height: 200, marginTop: 40 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(184,172,246,.25)", animation: "uply-spin 8s linear infinite" }}>
              {[0, 90, 180, 270].map(a => (
                <div key={a} style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 6, height: 6, marginLeft: -3, marginTop: -3,
                  background: "var(--accent-lavender)", borderRadius: "50%",
                  transform: `rotate(${a}deg) translate(98px)`,
                  boxShadow: "0 0 12px var(--accent-lavender)",
                }} />
              ))}
            </div>
            <div style={{ position: "absolute", inset: "8%", borderRadius: "50%",
              border: "1px dashed rgba(184,172,246,.4)",
              animation: "uply-spin 12s linear infinite reverse" }} />
            <div style={{
              position: "absolute", inset: "18%", borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, var(--accent-purple-soft), var(--accent-purple-mid))",
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
                  background: i < step ? "var(--accent-purple-soft)" : "transparent",
                  border: "1.5px solid var(--accent-purple-soft)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {i < step && <svg width="9" height="9" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {i === step && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-lavender)", animation: "uply-flicker .8s ease-in-out infinite" }} />}
                </div>
                <div style={{ color: i <= step ? "var(--bg-lavender-soft)" : "#5d567f", fontSize: 14, fontWeight: 500 }}>{s}</div>
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
        <div className="uply-serif" style={{ fontSize: 34, fontWeight: 700, color: "var(--text-ink)", lineHeight: 1.05, marginTop: 4 }}>
          {A.name}
        </div>
        <div style={{ fontSize: 14, color: "#5d567f", fontStyle: "italic", marginTop: 8, padding: "0 20px" }}>
          "{A.tagline}"
        </div>
      </div>

      {revealed >= 1 && (
        <div className="uply-fade-up" style={{
          background: "var(--bg-cream)", borderRadius: 18, padding: "16px 18px",
          boxShadow: "0 8px 24px rgba(8,4,40,.08)", marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, color: "var(--text-ink)", lineHeight: 1.5 }}>{A.description}</div>
        </div>
      )}

      {revealed >= 2 && (
        <div className="uply-fade-up" style={{
          background: "var(--bg-cream)", borderRadius: 18, padding: "16px 18px", marginBottom: 12,
          boxShadow: "0 8px 24px rgba(8,4,40,.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <div style={{ fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".28em", color: "var(--accent-purple-mid)" }}>WHAT YOU DID WELL</div>
          </div>
          {A.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", color: "var(--text-ink)", fontSize: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-purple-mid)" }} />
              {s}
            </div>
          ))}
        </div>
      )}

      {revealed >= 3 && (
        <div className="uply-fade-up" style={{
          background: "var(--bg-cream)", borderRadius: 18, padding: "16px 18px", marginBottom: 18,
          boxShadow: "0 8px 24px rgba(8,4,40,.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            <div style={{ fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".28em", color: "#b9802c" }}>YOUR GROWTH EDGES</div>
          </div>
          {A.edges.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", color: "var(--text-ink)", fontSize: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d39a3a" }} />
              {s}
            </div>
          ))}
        </div>
      )}

      {revealed >= 4 && (
        <div className="uply-fade-up">
          <PrimaryBtn onClick={onContinue}>This feels right</PrimaryBtn>
        </div>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  ReflectionScreen: "Does this reflect how you actually show up?"
// ║  Five-point self-check that maps back to three practice buckets.
// ╚══════════════════════════════════════════════════════════════════════
export type ReflectionBucket = "left" | "mid" | "right";

type ReflectionPoint = {
  label: string;
  bucket: ReflectionBucket;
  title: string;
  body: string;
};

const REFLECTION_POINTS: ReflectionPoint[] = [
  {
    label: "No",
    bucket: "right",
    title: "Got it. This was more rehearsal than reality.",
    body: "We will use the next scene to find a voice that feels more like you, with extra support before any big move.",
  },
  {
    label: "A little",
    bucket: "right",
    title: "There are a few true signals here.",
    body: "Some parts fit, but the full picture is still wider. The next practice will give you room to try a different rhythm.",
  },
  {
    label: "Somewhat",
    bucket: "mid",
    title: "Somewhere between rehearsal and reality",
    body: "Some of this is you, and some is the version you are practicing toward. That gap is a useful place to train.",
  },
  {
    label: "Mostly",
    bucket: "left",
    title: "This is close to how you usually show up.",
    body: "We will build from your natural style, then add one small stretch so the next ask feels clearer.",
  },
  {
    label: "Yes",
    bucket: "left",
    title: "Good news. We already know each other a little.",
    body: "What showed up on stage maps closely to your real-life style. The next scene can build from here.",
  },
];

export function ReflectionScreen({
  onContinue,
}: { onContinue: (bucket: ReflectionBucket) => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex == null ? null : REFLECTION_POINTS[selectedIndex];

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "auto",
      background: "linear-gradient(180deg, #f6f2e9 0%, #ebe5d7 100%)",
      padding: "62px 24px 28px",
      display: "flex", flexDirection: "column", minHeight: "100%",
    }}>
      <ActLabel color="var(--text-ink-mute)">DIRECTOR'S NOTE</ActLabel>
      <div className="uply-serif" style={{ color: "var(--text-ink)", fontSize: 27, fontWeight: 600, lineHeight: 1.15, marginTop: 10, maxWidth: 320 }}>
        Does this reflect how you actually show up?
      </div>
      <div style={{ color: "var(--text-ink-mute)", fontSize: 14, marginTop: 8 }}>
        Pick the point that feels closest. There is no wrong answer.
      </div>

      <div style={{ marginTop: 46, position: "relative", padding: "0 2px 8px" }}>
        <div style={{
          position: "absolute", left: 12, right: 12, top: 15,
          height: 7, borderRadius: 9999,
          background: "linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-lavender) 50%, var(--accent-purple-mid) 100%)",
          boxShadow: "inset 0 1px 3px rgba(40,30,110,.18)",
        }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 0, position: "relative", zIndex: 1 }}>
          {REFLECTION_POINTS.map((point, index) => {
            const active = selectedIndex === index;
            return (
              <button
                key={point.label}
                onClick={() => setSelectedIndex(index)}
                aria-pressed={active}
                style={{
                  border: "none", background: "transparent", padding: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  color: active ? "var(--accent-purple-mid)" : "var(--text-ink-mute)",
                  fontFamily: "inherit", cursor: "pointer", minWidth: 0,
                }}
              >
                <span style={{
                  width: active ? 28 : 18, height: active ? 28 : 18,
                  borderRadius: "50%",
                  background: active ? "var(--text-on-dark)" : "var(--accent-purple-soft)",
                  boxShadow: active
                    ? "0 6px 18px rgba(107,99,212,.38), 0 0 0 2px var(--accent-purple-mid)"
                    : "0 3px 8px rgba(107,99,212,.22)",
                  transition: "width 160ms ease, height 160ms ease, box-shadow 160ms ease",
                }} />
                <span style={{
                  minHeight: 26,
                  fontSize: 11,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  textAlign: "center",
                  maxWidth: 64,
                }}>
                  {point.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div className="uply-fade-up" style={{
          marginTop: 34, padding: "18px 18px",
          background: "var(--bg-cream)",
          borderRadius: 18, color: "var(--text-ink)",
          boxShadow: "0 8px 24px rgba(8,4,40,.08)",
        }}>
          <ActLabel color="var(--accent-purple-mid)">SYSTEM REPLY</ActLabel>
          <div className="uply-serif" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, marginBottom: 8 }}>
            {selected.title}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-ink-mute)", lineHeight: 1.5 }}>{selected.body}</div>
        </div>
      ) : (
        <div style={{
          marginTop: 34, minHeight: 132, borderRadius: 18,
          background: "rgba(255,255,255,.42)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-ink-mute)", fontSize: 13, fontWeight: 700,
          textAlign: "center", padding: "0 24px",
        }}>
          Choose one point to unlock your note.
        </div>
      )}

      <div style={{ marginTop: "auto", paddingTop: 24, paddingBottom: 8 }}>
        <PrimaryBtn
          disabled={!selected}
          onClick={() => selected && onContinue(selected.bucket)}
        >
          Next
        </PrimaryBtn>
      </div>
    </div>
  );
}
