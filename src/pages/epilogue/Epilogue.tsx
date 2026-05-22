/**
 * Uply Onboarding - EPILOGUE screens
 *
 * Flow:
 *   ReflectionScreen → GoalScreen   (pick first real-world scene)
 *                    → SloganScreen (curtain-call slogan, auto-advances)
 *                    → HomeScreen   (post-onboarding landing)
 *
 * GOALS drives which lesson the user starts; map to your lesson library.
 */
import { useEffect, useState } from "react";
import {
  Coffee,
  Flame,
  Handshake,
  Home,
  MessageCircle,
  MessageSquare,
  NotebookTabs,
  Play,
  RotateCcw,
  Star,
  User as UserIcon,
} from "lucide-react";
import { ActLabel, PrimaryBtn, UplyMark } from "@/components/ui/UplyUI";
import styles from "./Epilogue.module.css";

// ─────────────────────────────────────────────────────────────
// First-scene goals: these map to your starter-lesson library
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
// ║  GoalScreen: pick the first real-world social goal
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
// ║  SloganScreen: final curtain-call line; auto-advances after ~3.6s
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

// HomeScreen is the daily landing surface after onboarding.
export interface User { name?: string }

export function HomeScreen({
  user, points = 320, streak = 2, onRestart, onStartMission,
}: { user?: User; points?: number; streak?: number; onRestart?: () => void; onStartMission: () => void }) {
  const displayName = user?.name || "Mia";
  const modules = [
    {
      title: "LinkedIn Opener",
      subtitle: "Warm first message",
      meta: "Friendly alumni · 8 min",
      icon: MessageCircle,
    },
    {
      title: "Small Ask",
      subtitle: "Ask without pressure",
      meta: "Busy senior · 7 min",
      icon: Handshake,
    },
  ];
  const tabs = [
    { label: "Home", icon: Home, active: true },
    { label: "Coach", icon: MessageSquare, active: false },
    { label: "Records", icon: NotebookTabs, active: false },
    { label: "Me", icon: UserIcon, active: false },
  ];

  return (
    <div className={styles.homeScreen}>
      <header className={styles.homeHeader}>
        <div className={styles.avatar}>{displayName[0].toUpperCase()}</div>
        <div className={styles.userBlock}>
          <div className={styles.microLabel}>WELCOME BACK</div>
          <div className={styles.userName}>{displayName}</div>
        </div>
        <div className={styles.scoreStack} aria-label="Current progress">
          <div className={styles.scoreLine}><Star size={13} fill="currentColor" />{points} pts</div>
          <div className={styles.scoreLine}><Flame size={13} fill="currentColor" />{streak}-day streak</div>
        </div>
        {onRestart && (
          <button className={styles.replayButton} onClick={onRestart} aria-label="Replay onboarding" title="Replay">
            <RotateCcw size={16} />
          </button>
        )}
      </header>

      <button className={styles.todayCard} onClick={onStartMission}>
        <div className={styles.todayCopy}>
          <div className={styles.darkLabel}>TODAY'S SCRIPT</div>
          <div className={styles.todayTitle}>Coffee chat practice</div>
          <div className={styles.todaySub}>CS alum coffee chat · gentle pace · 10 min</div>
        </div>
        <div className={styles.coffeeScene} aria-hidden="true">
          <Coffee size={52} strokeWidth={1.8} />
          <div className={styles.sceneGlow} />
        </div>
        <span className={styles.homePrimaryButton}>
          <Play size={16} fill="currentColor" />
          Start Practice
        </span>
      </button>

      <section className={styles.moduleSection}>
        <div className={styles.sectionTitle}>NETWORKING MODULES</div>
        <div className={styles.moduleGrid}>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button className={styles.moduleCard} key={module.title} onClick={onStartMission}>
                <span className={styles.moduleIcon}><Icon size={21} /></span>
                <span className={styles.moduleTitle}>{module.title}</span>
                <span className={styles.moduleSub}>{module.subtitle}</span>
                <span className={styles.moduleMeta}>{module.meta}</span>
                <span className={styles.rehearseButton}>
                  <Play size={13} fill="currentColor" />
                  Rehearse
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className={styles.homeSpacer} />
      <nav className={styles.bottomNav} aria-label="Primary navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              className={tab.active ? styles.navButtonActive : styles.navButton}
              aria-label={tab.label}
              title={tab.label}
            >
              <Icon size={21} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
