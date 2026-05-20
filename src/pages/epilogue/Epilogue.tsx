/**
 * Uply Onboarding — EPILOGUE screens
 *
 * Flow:
 *   ReflectionScreen → GoalScreen   (pick first real-world scene)
 *                    → SloganScreen (curtain-call slogan, auto-advances)
 *                    → HomeScreen   (post-onboarding landing)
 *
 * GOALS drives which lesson the user starts; map to your lesson library.
 */
import { useEffect, useState } from "react";
import { ActLabel, PrimaryBtn, UplyMark } from "@/components/ui/UplyUI";

// ─────────────────────────────────────────────────────────────
// First-scene goals — these map to your starter-lesson library
// ─────────────────────────────────────────────────────────────
export type GoalId = "small-talk" | "follow-up" | "ask-help" | "pitch";

export interface Goal {
  id: GoalId;
  emoji: string;
  title: string;
  sub: string;
  scene: string;
}

export const GOALS: Goal[] = [
  { id: "small-talk", emoji: "☕",  title: "Start a conversation with someone new", sub: "Coffee chats, hallway hellos, party intros", scene: "CAFE · ACT I" },
  { id: "follow-up",  emoji: "✉️", title: "Follow up after meeting someone",         sub: "DMs, emails, asking for a second meet",      scene: "INBOX · ACT II" },
  { id: "ask-help",   emoji: "🤝", title: "Ask someone for help or advice",          sub: "Mentorship, intros, feedback requests",      scene: "OFFICE · ACT II" },
  { id: "pitch",      emoji: "🎙", title: "Speak up & share my idea in a group",     sub: "Meetings, classes, group dinners",           scene: "CLASSROOM · ACT III" },
];

// ╔══════════════════════════════════════════════════════════════════════
// ║  GoalScreen — pick the first real-world social goal
// ╚══════════════════════════════════════════════════════════════════════
export function GoalScreen({ onPick }: { onPick: (goalId: GoalId) => void }) {
  const [picked, setPicked] = useState<GoalId | null>(null);
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "auto",
      background: "linear-gradient(180deg, #f6f2e9 0%, #ebe5d7 100%)",
      padding: "70px 22px 32px",
      display: "flex", flexDirection: "column",
    }}>
      <ActLabel color="var(--text-ink-mute)">SET YOUR SCENE</ActLabel>
      <div className="uply-serif" style={{ color: "var(--text-ink)", fontSize: 28, fontWeight: 600, lineHeight: 1.2, marginTop: 10 }}>
        What's one small social thing you'd like to pull off?
      </div>
      <div style={{ color: "var(--text-ink-mute)", fontSize: 14, marginTop: 8, marginBottom: 24 }}>
        Your pick becomes your first real scene.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {GOALS.map(g => {
          const active = picked === g.id;
          return (
            <button key={g.id} onClick={() => setPicked(g.id)} style={{
              textAlign: "left", padding: "14px 16px", borderRadius: 18,
              background: active ? "var(--bg-lavender-soft)" : "var(--bg-cream)",
              border: active ? "1.5px solid var(--accent-purple-mid)" : "1px solid rgba(40,30,110,.08)",
              color: "var(--text-ink)", cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 14,
              transition: "all .2s ease",
              boxShadow: active
                ? "0 0 0 4px rgba(107,99,212,.12), 0 12px 24px rgba(8,4,40,.12)"
                : "0 4px 12px rgba(8,4,40,.06)",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: active ? "rgba(107,99,212,.18)" : "rgba(107,99,212,.08)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>{g.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: "var(--text-ink)" }}>{g.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-ink-mute)", marginTop: 3 }}>{g.sub}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".22em", color: "#b9802c", marginTop: 6 }}>{g.scene}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: active ? "2px solid var(--accent-purple-mid)" : "1.5px solid rgba(40,30,110,.18)",
                background: active ? "var(--accent-purple-mid)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {active && <svg width="11" height="11" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <PrimaryBtn disabled={!picked} glow={!!picked} onClick={() => picked && onPick(picked)}>
          {picked ? "Take me to the stage" : "Pick one scene"}
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  SloganScreen — final curtain-call line; auto-advances after ~3.6s
// ╚══════════════════════════════════════════════════════════════════════
export function SloganScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(), 3600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0726", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(50% 40% at 50% 50%, rgba(184,172,246,.18) 0%, rgba(184,172,246,0) 70%)" }} />
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 131) % 100}%`, top: `${(i * 73) % 100}%`,
          width: 3, height: 3, borderRadius: "50%", background: "var(--text-on-dark)",
          opacity: .2 + (i % 4) * .15,
          animation: `uply-flicker ${2 + (i % 4)}s ease-in-out infinite`,
          animationDelay: `${i * .1}s`,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0, padding: "0 32px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", color: "var(--text-on-dark)",
      }}>
        <div className="uply-fade-up" style={{ animationDelay: ".2s" }}>
          <UplyMark size={48} dark />
        </div>
        <div className="uply-serif uply-fade-up" style={{
          fontSize: 34, fontWeight: 600, lineHeight: 1.2, marginTop: 30,
          animationDelay: ".6s", maxWidth: 340,
        }}>Your show is about to begin.</div>
        <div className="uply-serif uply-fade-up" style={{
          fontSize: 22, fontStyle: "italic", color: "var(--accent-lavender)",
          marginTop: 18, animationDelay: "1.4s", maxWidth: 320,
        }}>Every step shapes the you to come.</div>
        <div className="uply-fade-up" style={{
          marginTop: 36, animationDelay: "2.2s",
          display: "flex", gap: 6, alignItems: "center",
          color: "var(--text-ink-mute)", fontSize: 12, letterSpacing: ".32em", fontWeight: 700,
        }}>
          <div style={{ width: 24, height: 1, background: "var(--text-ink-mute)" }} />
          END OF PROLOGUE
          <div style={{ width: 24, height: 1, background: "var(--text-ink-mute)" }} />
        </div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  HomeScreen — post-onboarding landing
// ╚══════════════════════════════════════════════════════════════════════
export interface User { name?: string }

export function HomeScreen({
  user, goalId, onRestart,
}: { user?: User; goalId?: GoalId; onRestart?: () => void }) {
  const goal = GOALS.find(g => g.id === goalId) || GOALS[0];
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "auto",
      background: "linear-gradient(180deg, #f6f2e9 0%, #ebe5d7 100%)",
      padding: "60px 18px 32px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: "linear-gradient(135deg,var(--accent-purple-soft),var(--accent-purple-mid))",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-on-dark)", fontWeight: 800, fontFamily: "'Playfair Display',serif",
          fontSize: 20, boxShadow: "0 6px 14px rgba(90,74,217,.3)",
        }}>{(user?.name || "U")[0].toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--fs-micro)", fontWeight: 700, color: "var(--text-ink-mute)", letterSpacing: ".22em" }}>WELCOME, ACTOR</div>
          <div className="uply-serif" style={{ fontSize: 20, fontWeight: 700, color: "var(--text-ink)" }}>{user?.name || "Friend"}</div>
        </div>
        {onRestart && (
          <button onClick={onRestart} style={{
            padding: "7px 12px", borderRadius: 9999, border: "1px solid #d8d2c0",
            background: "var(--bg-cream)", color: "var(--accent-purple-mid)", fontWeight: 700, fontSize: 12,
            cursor: "pointer", fontFamily: "inherit",
          }}>↻ Replay</button>
        )}
      </div>

      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #2a1f7a 0%, var(--accent-purple-mid) 100%)",
        borderRadius: 22, padding: "20px 20px 22px",
        color: "var(--text-on-dark)", overflow: "hidden",
        boxShadow: "0 16px 40px rgba(8,4,40,.25)",
      }}>
        <div style={{ position: "absolute", top: -40, right: -30, width: 180, height: 180,
          background: "radial-gradient(circle, rgba(255,247,214,.25), transparent 60%)" }} />
        <ActLabel color="var(--accent-lavender)">YOUR FIRST SCENE</ActLabel>
        <div className="uply-serif" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>
          {goal.title}
        </div>
        <div style={{ fontSize: "var(--fs-caption)", color: "#d8d0f9", marginTop: 6 }}>{goal.sub}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 18, alignItems: "center" }}>
          <div style={{ fontSize: 38 }}>{goal.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 9999,
                  background: i === 1 ? "var(--accent-gold)" : "rgba(255,255,255,.18)" }} />
              ))}
            </div>
            <div style={{ fontSize: "var(--fs-micro)", color: "#d8d0f9", fontWeight: 600, letterSpacing: ".18em" }}>
              {goal.scene} · 5 SCENES
            </div>
          </div>
        </div>
        <button style={{
          marginTop: 18, width: "100%", height: 48, borderRadius: 9999,
          background: "var(--text-on-dark)", color: "var(--text-ink)", fontWeight: 800, fontSize: 15,
          border: "none", cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 6px 16px rgba(0,0,0,.18)",
        }}>▶  Start Scene 1</button>
      </div>

      <div style={{
        marginTop: 14, background: "var(--bg-cream)", borderRadius: 18, padding: "14px 16px",
        boxShadow: "0 4px 12px rgba(8,4,40,.06)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ fontSize: 30 }}>🎭</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--fs-micro)", fontWeight: 700, letterSpacing: ".22em", color: "var(--accent-purple-mid)" }}>WARM-UP · 2 MIN</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-ink)", marginTop: 2 }}>Tonight's icebreaker line</div>
        </div>
        <div style={{ color: "var(--accent-purple-mid)", fontSize: 20 }}>→</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14 }}>
        {[{ n: "1", l: "SCENE DONE" }, { n: "🌙", l: "YOUR ROLE" }, { n: "T·17", l: "YOUR SEAT" }].map((s, i) => (
          <div key={i} style={{
            background: "var(--bg-cream)", borderRadius: 16, padding: "14px 10px", textAlign: "center",
            boxShadow: "0 4px 12px rgba(8,4,40,.06)",
          }}>
            <div className="uply-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-ink)" }}>{s.n}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".18em", color: "var(--text-ink-mute)", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".28em", color: "var(--text-ink-mute)", marginBottom: 10, paddingLeft: 4 }}>YOUR CAST</div>
        <div style={{
          background: "var(--bg-cream)", borderRadius: 18, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 4px 12px rgba(8,4,40,.06)",
        }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%,#c3b9f5,#7a6ee0 70%)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-ink)" }}>Maya Chen</div>
            <div style={{ fontSize: 12, color: "#5d567f", marginTop: 2 }}>Connected · After Party</div>
          </div>
          <div style={{
            padding: "6px 10px", borderRadius: 9999,
            background: "var(--bg-lavender-soft)", color: "var(--accent-purple-mid)", fontWeight: 800, fontSize: 10, letterSpacing: ".16em",
          }}>FOLLOWED ✓</div>
        </div>
      </div>

      <div style={{ height: 80 }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
        background: "linear-gradient(180deg, transparent, #ebe5d7 30%)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "10px 18px 24px", pointerEvents: "none",
      }}>
        <div style={{
          display: "flex", gap: 6, background: "var(--text-ink)", borderRadius: 9999, padding: 6,
          boxShadow: "0 12px 30px rgba(8,4,40,.35)", pointerEvents: "auto",
        }}>
          {[{ icon: "🎭", label: "Stage", active: true }, { icon: "📜", label: "Scripts" },
            { icon: "👥", label: "Cast" }, { icon: "⚙️", label: "You" }].map((t, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderRadius: 9999,
              background: t.active ? "var(--accent-purple-mid)" : "transparent",
              color: "var(--text-on-dark)", display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 700,
            }}>
              <span>{t.icon}</span>{t.active && t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
