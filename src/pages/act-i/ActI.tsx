/**
 * Uply Onboarding — ACT I screens
 *
 * Flow:
 *   curtain → StageScreen (after-party encounter)
 *           → ConversationScreen (dialog with Maya)
 *           → LinkedInScreen (connection confirmed)
 *
 * Each screen renders inside an absolutely-positioned full-bleed container.
 * Drop them into your phone-frame's screen slot.
 */
import { useState, useEffect } from "react";
import {
  SolidFigure, Chip, SpeechBubble,
  MicButton, TypingDots, PrimaryBtn,
} from "@/components/ui/UplyUI";
import sceneWithSilhouette from "@/assets/after-party/scene-with-silhouette.png";

// ╔══════════════════════════════════════════════════════════════════════
// ║  StageScreen — illustrated daytime "After Party" setting
// ║  Maya greets the user; tap the mic to enter the dialogue.
// ╚══════════════════════════════════════════════════════════════════════
export function StageScreen({ onMicTap }: { onMicTap: () => void }) {
  const [taskChecked, setTaskChecked] = useState(false);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <PartyBackdrop />

      {/* Top scene chip */}
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 6 }}>
        <Chip dark={false} style={{
          background: "rgba(255,255,255,.78)", backdropFilter: "blur(10px)",
          color: "var(--accent-purple-mid)", fontWeight: 800, letterSpacing: ".18em",
          padding: "8px 16px", fontSize: "var(--fs-micro)",
          boxShadow: "0 4px 14px rgba(8,4,40,.12)",
        }}>· FINAL PRESENTATION AFTER PARTY ·</Chip>
      </div>

      {/* Task chip top-left */}
      <div className="uply-fade-up" style={{ position: "absolute", top: 104, left: 14, zIndex: 6 }}>
        <button onClick={() => setTaskChecked(v => !v)} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px 8px 10px", borderRadius: 9999,
          background: "rgba(255,255,255,.7)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(90,74,217,.18)", cursor: "pointer",
          color: "var(--accent-purple-mid)", fontFamily: "inherit", fontWeight: 700, fontSize: "var(--fs-caption)",
          boxShadow: "0 4px 14px rgba(8,4,40,.08)",
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 5,
            border: taskChecked ? "2px solid var(--accent-purple-mid)" : "1.5px solid var(--accent-purple-soft)",
            background: taskChecked ? "var(--accent-purple-mid)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {taskChecked && <svg width="10" height="10" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span>🔗 Add alumni on LinkedIn</span>
        </button>
      </div>

      {/* NPC speech bubble */}
      <div className="uply-fade-up" style={{ position: "absolute", top: 184, left: 20, zIndex: 6, maxWidth: 240, animationDelay: ".4s" }}>
        <div style={{
          background: "rgba(255,255,255,.96)", color: "var(--text-ink)",
          padding: "14px 18px", borderRadius: "20px 20px 20px 4px",
          fontSize: 17, lineHeight: 1.3, fontWeight: 500,
          boxShadow: "0 8px 24px rgba(8,4,40,.18)",
        }}>Hi, your presentation was great!</div>
      </div>

      {/* The solid figure (centered) */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
        <div className="uply-fade" style={{ animationDelay: ".2s" }}>
          <SolidFigure size={180} />
        </div>
      </div>

      {/* Bio card under figure */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "70%", zIndex: 6 }}>
        <div className="uply-fade" style={{ animationDelay: ".6s" }}>
          <div style={{
            background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)",
            borderRadius: 14, padding: "10px 18px",
            boxShadow: "0 8px 20px rgba(8,4,40,.12)",
            textAlign: "center", minWidth: 230,
            border: "1px solid rgba(255,255,255,.6)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--accent-purple-mid)", lineHeight: 1.2, whiteSpace: "nowrap" }}>Female Senior · Same Major</div>
            <div style={{ fontSize: 12, color: "var(--text-ink-mute)", marginTop: 3, fontWeight: 600 }}>Seen at the library before</div>
          </div>
        </div>
      </div>

      {/* Mic + prompt */}
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, zIndex: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div className="uply-fade-up" style={{
          fontSize: 14, color: "rgba(255,255,255,.92)",
          textShadow: "0 1px 6px rgba(8,4,40,.5), 0 0 14px rgba(8,4,40,.3)",
          fontWeight: 600, animationDelay: "1s",
        }}>Want to say hi first?</div>
        <button onClick={onMicTap} className="uply-fade-up" style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "rgba(255,255,255,.55)", backdropFilter: "blur(14px)",
          border: "1.5px solid rgba(255,255,255,.7)",
          boxShadow: "0 8px 24px rgba(8,4,40,.25), inset 0 1px 0 rgba(255,255,255,.6)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          animationDelay: "1.2s",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--accent-purple-mid)">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M7 11a5 5 0 0010 0" stroke="var(--accent-purple-mid)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12" y2="20" stroke="var(--accent-purple-mid)" strokeWidth="2" strokeLinecap="round" />
            <line x1="9" y1="20" x2="15" y2="20" stroke="var(--accent-purple-mid)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  ConversationScreen — branching dialogue with Maya
// ║  - 4 beats with response options
// ║  - last beat has a special "ending trigger" choice that completes
// ╚══════════════════════════════════════════════════════════════════════
type Choice = { text: string; next?: number; ending?: boolean };
type Beat   = { npc: string; hint: string | null; choices: Choice[] };

const SCRIPT: Beat[] = [
  {
    npc: "Hi! Your presentation was great — really clear.",
    hint: null,
    choices: [
      { text: "Thanks! I was actually really nervous.", next: 1 },
      { text: "Oh — thank you, that means a lot.",       next: 1 },
      { text: "Yeah it went okay, I guess.",             next: 1 },
    ],
  },
  {
    npc: "Aren't you usually at the library too? I feel like I've seen you on the second floor.",
    hint: "She's making small talk. Mirror her energy — share something specific.",
    choices: [
      { text: "Yeah — I camp at the reading room most nights.", next: 2 },
      { text: "Probably! I basically live there during finals.", next: 2 },
      { text: "Maybe? I'm there a lot, honestly.",               next: 2 },
    ],
  },
  {
    npc: "I'm graduating this spring — just accepted a PM role at a small startup, actually.",
    hint: "Try asking about her project or company.",
    choices: [
      { text: "Congrats! What does the startup do?", next: 3 },
      { text: "Oh wow, what kind of product?",       next: 3 },
      { text: "That's huge. How'd you find them?",    next: 3 },
    ],
  },
  {
    npc: "We're building handoff tools for designers — early stage but the team is great.",
    hint: "Good moment to exchange contacts. Be specific about why.",
    choices: [
      { text: "Can I follow you on LinkedIn?",                       ending: true },
      { text: "That sounds super cool — let me know how it goes!",   next: 3 },
      { text: "Nice. Well, see you around the library!",             next: 3 },
    ],
  },
];

type Phase =
  | "mission"
  | "countdown" | "npc-typing" | "npc-speaking" | "choosing"
  | "user-speaking" | "ending-npc-typing" | "ending"
  | "complete";

type Variant = "a" | "b";
type Task = { id: string; label: string; icon: string };

const TASKS_A: Task[] = [
  { id: "linkedin", label: "Connect on LinkedIn", icon: "🔗" },
];

const TASKS_B: Task[] = [
  { id: "greet",  label: "Break the ice",             icon: "👋" },
  { id: "common", label: "Find one common thread",    icon: "🧵" },
  { id: "ask",    label: "Ask to connect on LinkedIn", icon: "🔗" },
];

function readVariant(): Variant {
  if (typeof window === "undefined") return "a";
  const v = new URLSearchParams(window.location.search).get("variant");
  return v === "b" ? "b" : "a";
}

const MAYA_NAME = "Maya";

export function ConversationScreen({
  onComplete, onSkip,
}: { onComplete: () => void; onSkip: () => void }) {
  const [phase, setPhase] = useState<Phase>("mission");
  const [beat, setBeat] = useState(-1);
  const [history, setHistory] = useState<{ who: "npc" | "me"; text: string }[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [tasksDone, setTasksDone] = useState<Set<string>>(new Set());
  const [checklistExpanded, setChecklistExpanded] = useState(false);

  const variant = readVariant();
  const tasks = variant === "b" ? TASKS_B : TASKS_A;

  const markTask = (id: string) => setTasksDone(s => new Set(s).add(id));

  const playNpcBeat = (i: number) => {
    setBeat(i);
    setPhase("npc-typing");
    setShowHint(false);
    setTimeout(() => {
      setPhase("npc-speaking");
      setHistory(h => [...h, { who: "npc", text: SCRIPT[i].npc }]);
      setTimeout(() => {
        if (SCRIPT[i].hint) setShowHint(true);
        setPhase("choosing");
      }, 1300);
    }, 900);
  };

  // After user responds to beat 0 → mark "greet" done (variant B)
  // After beat 2 (career chitchat) → mark "common" done (variant B)
  useEffect(() => {
    if (variant !== "b") return;
    if (beat >= 1 && !tasksDone.has("greet"))  markTask("greet");
    if (beat >= 2 && !tasksDone.has("common")) markTask("common");
  }, [beat, variant]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { playNpcBeat(0); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const startMission = () => {
    setPhase("countdown");
    setCountdown(3);
  };

  const pickChoice = (c: Choice) => {
    setShowHint(false);
    setPhase("user-speaking");
    setTimeout(() => {
      setHistory(h => [...h, { who: "me", text: c.text }]);
      if (c.ending) {
        markTask(variant === "b" ? "ask" : "linkedin");
        setPhase("ending-npc-typing");
        setTimeout(() => {
          setHistory(h => [...h, { who: "npc", text: "Of course! Let me add you right now 🌟" }]);
          setPhase("ending");
          setTimeout(() => setPhase("complete"), 1600);
        }, 1100);
      } else {
        playNpcBeat(c.next!);
      }
    }, 1400);
  };

  const latestNpc = [...history].reverse().find(x => x.who === "npc");
  const latestMe  = [...history].reverse().find(x => x.who === "me");
  const current   = beat >= 0 ? SCRIPT[beat] : null;
  const inDialog  = phase !== "mission" && phase !== "complete";

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
    }}>
      {/* After-party scene as background (same as #5) */}
      <img
        src={sceneWithSilhouette}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
        }}
      />
      {/* Soft vignette so chips / bubbles read against bright bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(20, 14, 50, 0.4) 100%)",
        zIndex: 1,
      }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>

        {/* Maya name tag (chest) — visible in dialog and complete phases */}
        {inDialog && (
          <div style={{
            position: "absolute", top: "44%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
            borderRadius: 8, padding: "4px 10px",
            fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".18em",
            color: "var(--accent-purple-mid)",
            boxShadow: "0 4px 12px rgba(40,30,110,.18)",
            zIndex: 4,
          }}>
            {MAYA_NAME.toUpperCase()}
          </div>
        )}

        {/* PHASE: mission — full-screen mission card */}
        {phase === "mission" && (
          <div className="uply-fade-up" style={{
            position: "absolute", left: 22, right: 22, top: "52%", transform: "translateY(-50%)",
            background: "var(--bg-cream)", borderRadius: 22,
            padding: "22px 22px 18px",
            boxShadow: "0 24px 60px rgba(8,4,40,.32), 0 6px 16px rgba(8,4,40,.18)",
            zIndex: 10,
          }}>
            <div style={{ fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".22em", color: "var(--accent-purple-mid)" }}>
              YOUR MISSION
            </div>
            <div className="uply-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-ink)", lineHeight: 1.2, marginTop: 6 }}>
              Connect on LinkedIn
            </div>
            <div style={{ fontSize: 14, color: "var(--text-ink-mute)", lineHeight: 1.45, marginTop: 10 }}>
              You ran into a senior you'd seen before at the library — turns out she's at the same school party. You wanted to connect with her on LinkedIn.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={onSkip} style={{
                flex: 1, height: 48, borderRadius: 14, border: "1px solid rgba(40,30,110,.18)",
                background: "transparent", color: "var(--text-ink-mute)",
                fontWeight: 700, fontSize: 15, fontFamily: "inherit", cursor: "pointer",
              }}>Skip</button>
              <button onClick={startMission} style={{
                flex: 1.4, height: 48, borderRadius: 14, border: "none",
                background: "linear-gradient(180deg, var(--btn-active-top) 0%, var(--btn-active-bottom) 100%)",
                color: "var(--text-on-dark)", fontWeight: 700, fontSize: 15, fontFamily: "inherit", cursor: "pointer",
                boxShadow: "0 5px 0 var(--btn-shadow), 0 8px 24px rgba(107,99,212,0.38)",
              }}>Start</button>
            </div>
          </div>
        )}

        {/* In-dialog persistent: top scene chip + task checklist */}
        {inDialog && (
          <>
            <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", zIndex: 8 }}>
              <Chip>🎓 After Party</Chip>
            </div>

            {(() => {
              const currentIdx = tasks.findIndex(tk => !tasksDone.has(tk.id));
              const allDone = currentIdx === -1;
              const doneCount = tasks.filter(t => tasksDone.has(t.id)).length;
              const visibleTasks = checklistExpanded
                ? tasks
                : (allDone ? tasks.slice(-1) : [tasks[currentIdx]]);

              return (
                <div style={{
                  position: "absolute", top: 100, left: 14, zIndex: 8,
                  maxWidth: 220, display: "flex", flexDirection: "column", gap: 6,
                }}>
                  <button onClick={() => setChecklistExpanded(v => !v)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
                    padding: "2px 4px 4px", background: "transparent", border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                    textShadow: "0 1px 4px rgba(255,255,255,0.6)",
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: ".22em",
                      color: "var(--accent-purple-mid)",
                    }}>
                      MISSION · {doneCount}/{tasks.length}
                    </div>
                    <span style={{
                      fontSize: 11, color: "var(--accent-purple-mid)",
                      transform: checklistExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform .2s ease",
                    }}>▾</span>
                  </button>
                  {visibleTasks.map(t => {
                    const idx = tasks.indexOf(t);
                    const done = tasksDone.has(t.id);
                    const isNow = !done && idx === currentIdx;

                    const bg = done
                      ? "rgba(255,255,255,0.78)"
                      : isNow
                      ? "var(--text-on-dark)"
                      : "var(--bg-lavender-soft)";
                    const border = isNow ? "1.5px solid var(--accent-purple-mid)" : "1px solid rgba(40,30,110,0.08)";

                    return (
                      <div key={t.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 9px", borderRadius: 10,
                        background: bg, border,
                        backdropFilter: "blur(8px)",
                        boxShadow: isNow
                          ? "0 6px 16px rgba(107,99,212,0.18)"
                          : "0 2px 6px rgba(40,30,110,0.08)",
                      }}>
                        {done ? (
                          <span style={{
                            width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                            background: "var(--accent-lavender)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="11" height="11" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        ) : (
                          <span style={{
                            width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                            background: isNow ? "var(--bg-lavender-soft)" : "rgba(255,255,255,0.7)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11,
                          }}>{t.icon}</span>
                        )}
                        <span style={{
                          fontSize: 11.5, fontWeight: 700, lineHeight: 1.25,
                          flex: 1, minWidth: 0,
                          color: done ? "var(--text-ink-mute)" : "var(--text-ink)",
                          textDecoration: done ? "line-through" : "none",
                        }}>{t.label}</span>
                        {isNow && (
                          <span style={{
                            fontSize: 8.5, fontWeight: 800, letterSpacing: ".14em",
                            color: "#8a5a30",
                            background: "var(--accent-gold)",
                            padding: "2px 6px", borderRadius: 999,
                            flexShrink: 0,
                          }}>NOW</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}

        {/* NPC bubble — top-right, above Maya's head, clear of left checklist */}
        {(phase === "npc-typing" || phase === "npc-speaking" || phase === "choosing" || phase === "ending-npc-typing" || phase === "ending") && latestNpc && (
          <div className="uply-fade-up" key={latestNpc.text} style={{
            position: "absolute", top: "13%", left: 220, right: 18,
            display: "flex", justifyContent: "flex-end", zIndex: 7,
          }}>
            <div style={{ maxWidth: 180 }}>
              <SpeechBubble tail="bottom-left">
                {(phase === "npc-typing" || phase === "ending-npc-typing") ? <TypingDots color="var(--text-ink-mute)" /> : latestNpc.text}
              </SpeechBubble>
            </div>
          </div>
        )}

        {/* Countdown — quick "she'll speak in Ns" indicator */}
        {phase === "countdown" && (
          <div className="uply-fade" style={{
            position: "absolute", top: "22%", left: 0, right: 0,
            textAlign: "center", color: "var(--text-on-dark)", zIndex: 7,
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 13, opacity: .85 }}>She'll speak in</div>
            <div className="uply-serif" style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>{Math.max(0, countdown)}s</div>
          </div>
        )}

        {/* Hint banner */}
        {showHint && current?.hint && phase === "choosing" && (
          <div className="uply-fade-up" style={{
            position: "absolute", bottom: 240, left: 18, right: 18, zIndex: 9,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
            borderRadius: 14, padding: "10px 14px",
            display: "flex", alignItems: "flex-start", gap: 10,
            color: "var(--text-ink)", fontSize: 12.5, lineHeight: 1.4,
            boxShadow: "0 6px 18px rgba(40,30,110,.16)",
          }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <div><b style={{ color: "var(--accent-purple-mid)", letterSpacing: ".06em" }}>HINT · </b>{current.hint}</div>
          </div>
        )}

        {/* User speech bubble — above mic */}
        {phase === "user-speaking" && latestMe && (
          <div className="uply-fade-up" style={{
            position: "absolute", bottom: 130, left: 24, right: 24, zIndex: 8,
            display: "flex", justifyContent: "center",
          }}>
            <div style={{
              maxWidth: 280, padding: "12px 16px", borderRadius: 18,
              background: "var(--btn-gradient)", color: "var(--text-on-dark)",
              fontSize: 14, fontWeight: 500, lineHeight: 1.4,
              boxShadow: "0 8px 24px rgba(107,99,212,.38)",
            }}>{latestMe.text}</div>
          </div>
        )}

        {/* Choices (bottom) */}
        {phase === "choosing" && current && (
          <div className="uply-fade-up" style={{
            position: "absolute", bottom: 20, left: 14, right: 14, zIndex: 10,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {current.choices.map((c, i) => (
              <button key={i} onClick={() => pickChoice(c)} style={{
                background: c.ending
                  ? "linear-gradient(180deg, var(--btn-active-top) 0%, var(--btn-active-bottom) 100%)"
                  : "rgba(255,255,255,0.88)",
                color: c.ending ? "var(--text-on-dark)" : "var(--text-ink)",
                textAlign: "left",
                padding: "13px 16px", borderRadius: 14,
                border: "none",
                fontSize: 14, fontWeight: 600, lineHeight: 1.3,
                cursor: "pointer", fontFamily: "inherit",
                backdropFilter: c.ending ? "none" : "blur(8px)",
                boxShadow: c.ending
                  ? "0 5px 0 var(--btn-shadow), 0 8px 24px rgba(107,99,212,0.38)"
                  : "0 4px 12px rgba(40,30,110,.16)",
              }}>{c.ending && <span style={{ marginRight: 6 }}>🔗</span>}{c.text}</button>
            ))}
          </div>
        )}

        {/* Mic indicator while user "speaking" */}
        {phase === "user-speaking" && (
          <div className="uply-fade" style={{
            position: "absolute", bottom: 30, left: 0, right: 0,
            display: "flex", justifyContent: "center", zIndex: 9,
          }}>
            <MicButton active size={64} />
          </div>
        )}

        {/* PHASE: complete — mission completion card */}
        {phase === "complete" && (
          <div className="uply-fade-up" style={{
            position: "absolute", left: 22, right: 22, top: "50%", transform: "translateY(-50%)",
            background: "var(--bg-cream)", borderRadius: 22,
            padding: "24px 22px 20px", textAlign: "center",
            boxShadow: "0 24px 60px rgba(8,4,40,.32)",
            zIndex: 10,
          }}>
            <div style={{ fontSize: 36 }}>🎉</div>
            <div style={{ fontSize: "var(--fs-micro)", fontWeight: 800, letterSpacing: ".22em", color: "var(--accent-purple-mid)", marginTop: 8 }}>
              MISSION COMPLETE
            </div>
            <div className="uply-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-ink)", lineHeight: 1.2, marginTop: 6 }}>
              Connected with {MAYA_NAME}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-ink-mute)", lineHeight: 1.5, marginTop: 8 }}>
              You held the conversation, found common ground, and made the ask. That's a real skill.
            </div>
            <button onClick={onComplete} style={{
              marginTop: 18, width: "100%", height: 48, borderRadius: 14, border: "none",
              background: "linear-gradient(180deg, var(--btn-active-top) 0%, var(--btn-active-bottom) 100%)",
              color: "var(--text-on-dark)", fontWeight: 700, fontSize: 15, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 5px 0 var(--btn-shadow), 0 8px 24px rgba(107,99,212,0.38)",
            }}>Continue →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  LinkedInScreen — connection-accepted result animation
// ╚══════════════════════════════════════════════════════════════════════
export function LinkedInScreen({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1400);
    const t2 = setTimeout(() => setStep(2), 2800);
    return () => { [t1, t2].forEach(clearTimeout); };
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f3f2ef", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "var(--brand-linkedin)", color: "var(--text-on-dark)", padding: "48px 18px 12px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--text-on-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "var(--brand-linkedin)", fontSize: "var(--fs-h2)", fontFamily: "serif" }}>in</div>
        <div style={{ flex: 1, height: 32, borderRadius: 4, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", padding: "0 10px", fontSize: "var(--fs-caption)", fontWeight: 500, opacity: .9 }}>
          <span style={{ opacity: .7 }}>🔍</span><span style={{ marginLeft: 8, opacity: .8 }}>Maya Chen</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px 18px", overflow: "auto" }}>
        <div style={{ background: "var(--text-on-dark)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ height: 80, background: "linear-gradient(120deg,var(--accent-purple-mid),var(--accent-purple-soft))" }} />
          <div style={{ padding: "0 18px 18px", position: "relative" }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%,#c3b9f5,#7a6ee0 70%)",
              border: "4px solid var(--text-on-dark)", marginTop: -44,
            }} />
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#000" }}>Maya Chen</div>
              <div style={{ color: "#000", fontSize: 14, marginTop: 2 }}>Incoming PM @ Handoff · CS @ University · she/her</div>
              <div style={{ color: "#666", fontSize: "var(--fs-caption)", marginTop: 6 }}>San Francisco Bay Area · 312 followers</div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              {step >= 1 ? (
                <button style={{
                  padding: "7px 16px", borderRadius: 9999, border: "none",
                  background: "var(--accent-purple-mid)", color: "var(--text-on-dark)", fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(90,74,217,.35)",
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Following
                </button>
              ) : (
                <button style={{
                  padding: "7px 16px", borderRadius: 9999, border: "1px solid var(--brand-linkedin)",
                  background: "var(--text-on-dark)", color: "var(--brand-linkedin)", fontWeight: 700, fontSize: 14,
                  fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid var(--brand-linkedin)", borderTopColor: "transparent", animation: "uply-spin 1s linear infinite" }} />
                  Pending
                </button>
              )}
              <button style={{ padding: "7px 16px", borderRadius: 9999, border: "1px solid var(--brand-linkedin)", background: "var(--text-on-dark)", color: "var(--brand-linkedin)", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}>Message</button>
            </div>
          </div>
        </div>
        {step >= 1 && (
          <div className="uply-fade-up" style={{
            marginTop: 14, padding: "14px 16px", borderRadius: 12,
            background: "#e6f4ea", border: "1px solid #b6dfc1",
            display: "flex", gap: 12, alignItems: "center",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="var(--text-on-dark)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1b5e20" }}>Maya accepted your invitation</div>
              <div style={{ fontSize: 12.5, color: "#3f6f44", marginTop: 2 }}>You're now connected on LinkedIn.</div>
            </div>
          </div>
        )}
      </div>
      {step >= 2 && (
        <div className="uply-fade-up" style={{ padding: "14px 18px 26px", background: "linear-gradient(180deg, transparent, #f3f2ef 50%)" }}>
          <PrimaryBtn onClick={onContinue}>End of Act I  →</PrimaryBtn>
        </div>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════
// ║  PartyBackdrop — illustrated daytime "After Party" backdrop
// ║  (Science Building facade + bunting + plants + tables + tile floor)
// ╚══════════════════════════════════════════════════════════════════════
function PartyBackdrop() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden",
      background: "linear-gradient(180deg, #cfd9e8 0%, #d8d3e0 35%, #d4c4ae 55%, #c9b59a 100%)" }}>
      <div style={{ position: "absolute", top: -40, left: "30%", width: 300, height: 200,
        background: "radial-gradient(circle, rgba(255,235,200,.6), transparent 60%)", filter: "blur(20px)" }} />
      <div style={{
        position: "absolute", top: "8%", left: "8%", right: "8%", height: "42%",
        background: "linear-gradient(180deg, #d4dce5 0%, #b8c4d4 60%, #a5b3c4 100%)",
        borderRadius: "8px 8px 0 0",
        boxShadow: "inset 0 -20px 40px rgba(0,0,0,.08)",
      }}>
        {[10, 82].map((x, i) => (
          <div key={i} style={{
            position: "absolute", top: "18%", bottom: 0, left: `${x}%`, width: "8%",
            background: "linear-gradient(90deg, #e9eef4, #c8d1de)",
            borderRadius: "4px 4px 0 0",
          }} />
        ))}
        <div style={{
          position: "absolute", top: "28%", left: "34%", right: "34%", bottom: 0,
          background: "linear-gradient(180deg, #4a6a90, #2a4570)",
          borderRadius: "6px 6px 0 0",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,.2)",
        }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,.25)" }} />
        </div>
        <div style={{
          position: "absolute", top: "8%", left: "12%", right: "12%", height: "18%",
          color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, letterSpacing: ".16em", fontFamily: "serif",
        }}>SCIENCE BUILDING</div>
      </div>

      <Bunting top={170} from={4} to={48} count={8} colors={["#e6896d", "#f3c662", "#7faddb", "#e8a3c4", "#9ec98c"]} />
      <Bunting top={170} from={52} to={96} count={8} colors={["#f3c662", "#9ec98c", "#e6896d", "#7faddb", "#e8a3c4"]} />

      <Plant left="6%" bottom="22%" size={70} />
      <Plant left="82%" bottom="22%" size={70} />

      <Table left="0%" bottom="14%" />
      <Table left="80%" bottom="14%" />

      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "24%",
        background: "linear-gradient(180deg, #c9b59a 0%, #b8a380 60%, #a89570 100%)",
      }}>
        {[0, 20, 40, 60, 80, 100].map(p => (
          <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1,
            background: "rgba(120,90,50,.18)", transform: "skewX(-12deg)" }} />
        ))}
        {[0, 40, 80].map(p => (
          <div key={p} style={{ position: "absolute", left: 0, right: 0, top: `${p}%`, height: 1,
            background: "rgba(120,90,50,.14)" }} />
        ))}
      </div>

      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(80% 50% at 50% 65%, rgba(255,210,150,.18) 0%, transparent 60%)",
        pointerEvents: "none" }} />
    </div>
  );
}

function Bunting({ top, from, to, count, colors }: { top: number; from: number; to: number; count: number; colors: string[] }) {
  const flags = Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1);
    const x = from + (to - from) * t;
    const sag = Math.sin(t * Math.PI) * 24;
    return { x, y: top + sag, color: colors[i % colors.length], i };
  });
  return (
    <>
      <svg width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="none"
        style={{ position: "absolute", top: top - 4, left: 0, pointerEvents: "none" }}>
        <path d={`M${from} 0 Q${(from + to) / 2} 50 ${to} 0`} stroke="rgba(80,55,30,.45)" strokeWidth=".3" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {flags.map(f => (
        <div key={f.i} style={{
          position: "absolute", top: f.y, left: `${f.x}%`,
          width: 0, height: 0,
          borderLeft: "9px solid transparent",
          borderRight: "9px solid transparent",
          borderTop: `14px solid ${f.color}`,
          transform: "translateX(-9px)",
          filter: "drop-shadow(0 2px 1px rgba(0,0,0,.1))",
        }} />
      ))}
    </>
  );
}

function Plant({ left, bottom, size }: { left: string; bottom: string; size: number }) {
  return (
    <div style={{ position: "absolute", left, bottom, width: size, height: size * 1.3 }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: size * .9, height: size * .9, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #b8d99c, #6fa46b 70%, #4d7e58)",
        boxShadow: "inset -4px -8px 12px rgba(0,0,0,.18)" }} />
      <div style={{ position: "absolute", top: size * .18, left: "18%",
        width: size * .4, height: size * .4, borderRadius: "50%",
        background: "radial-gradient(circle, #a3cf85, #6fa46b)" }} />
      <div style={{ position: "absolute", top: size * .18, right: "18%",
        width: size * .42, height: size * .42, borderRadius: "50%",
        background: "radial-gradient(circle, #a3cf85, #5f9560)" }} />
      <div style={{ position: "absolute", bottom: 0, left: "18%", right: "18%", height: size * .45,
        background: "linear-gradient(180deg, #c98d65, #a06340)",
        borderRadius: "4px 4px 8px 8px / 4px 4px 18px 18px",
        boxShadow: "inset 0 -8px 14px rgba(0,0,0,.25)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: size * .08,
          background: "#9a5a3a", borderRadius: "4px 4px 0 0" }} />
      </div>
    </div>
  );
}

function Table({ left, bottom }: { left: string; bottom: string }) {
  return (
    <div style={{ position: "absolute", left, bottom, width: 130, height: 90 }}>
      <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 50,
        background: `repeating-linear-gradient(90deg, rgba(217,166,118,.95) 0 14px, rgba(245,222,180,.95) 14px 28px),
                     repeating-linear-gradient(0deg, rgba(217,166,118,.5) 0 14px, rgba(245,222,180,.5) 14px 28px)`,
        backgroundBlendMode: "multiply",
        borderRadius: "4px 4px 0 0",
        boxShadow: "0 8px 14px rgba(0,0,0,.12)",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 10, width: 6, height: 40, background: "#8a5a30", borderRadius: 2 }} />
      <div style={{ position: "absolute", bottom: 0, right: 10, width: 6, height: 40, background: "#8a5a30", borderRadius: 2 }} />
      <div style={{ position: "absolute", top: 0, left: 20, width: 34, height: 18, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 30%, #f0d59c, #c89a5f)" }} />
      <div style={{ position: "absolute", top: -4, left: 60, width: 30, height: 22, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 30%, #e88a8a, #c54b4b)" }} />
      <div style={{ position: "absolute", top: 0, right: 14, width: 26, height: 18, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 30%, #d8c098, #a8865f)" }} />
    </div>
  );
}
