import { useState } from "react";
import { ChevronDown, ChevronLeft, Coffee, Mic2, Sparkles, Target } from "lucide-react";
import {
  buildDefaultOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboardingProfile";
import styles from "./MissionPage.module.css";

interface MissionPageProps {
  profile?: OnboardingProfile | null;
  missionLabel?: string;
  missionTitle?: string;
  missionSubtitle?: string;
  partnerName?: string;
  partnerRole?: string;
  partnerStyle?: string;
  sceneLabel?: string;
  taskTitle?: string;
  taskDescription?: string;
  taskHint?: string;
  startButtonText?: string;
  onBack: () => void;
  onStartPractice: () => void;
}

export function MissionPage({
  profile,
  missionLabel = "TODAY'S MISSION",
  missionTitle,
  missionSubtitle,
  partnerName,
  partnerRole,
  partnerStyle,
  sceneLabel = "Coffee chat",
  taskTitle = "Personal goal",
  taskDescription,
  taskHint,
  startButtonText = "Curtain up",
  onBack,
  onStartPractice,
}: MissionPageProps) {
  const [expanded, setExpanded] = useState(false);
  const activeProfile = profile ?? buildDefaultOnboardingProfile();
  const promptSeed = activeProfile.firstLessonPromptSeed;

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button className={styles.iconButton} onClick={onBack} aria-label="Back to home">
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div>
          <div className={styles.eyebrow}>{missionLabel}</div>
          <div className={styles.title}>{missionTitle ?? promptSeed.sceneTitle}</div>
        </div>
      </div>

      <div className={styles.stack}>
        <section className={styles.heroCard}>
          <div className={styles.heroVisual} aria-hidden="true">
            <Coffee size={48} strokeWidth={1.8} />
          </div>
          <div className={styles.partnerRow}>
            <div className={styles.silhouette} aria-hidden="true" />
            <div>
              <div className={styles.partnerName}>{partnerName ?? promptSeed.partnerName}</div>
              <div className={styles.partnerRole}>{partnerRole ?? promptSeed.partnerRole}</div>
            </div>
          </div>
          {missionSubtitle ? <div className={styles.mutedText}>{missionSubtitle}</div> : null}

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Scene</div>
              <div className={styles.metaValue}>{sceneLabel}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Style</div>
              <div className={styles.metaValue}>{partnerStyle ?? "Gentle"}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Time</div>
              <div className={styles.metaValue}>10 min</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Target size={15} />
            {taskTitle}
          </div>
          <div className={styles.bodyText}>{taskDescription ?? activeProfile.selectedGoal.personalObjective}</div>
          <div className={styles.mutedText}>{taskHint ?? activeProfile.selectedGoal.title}</div>
        </section>

        <section className={styles.strategyPanel}>
          <button className={styles.strategyButton} onClick={() => setExpanded((value) => !value)}>
            <span className={styles.sectionHeader} style={{ marginBottom: 0 }}>
              <Sparkles size={15} />
              Tip and strategy
            </span>
            <ChevronDown
              size={18}
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 160ms ease" }}
            />
          </button>

          {expanded && (
            <div className={styles.strategyList}>
              <div className={styles.chipRow}>
                {promptSeed.strategyChips.map((chip) => (
                  <span className={styles.strategyChip} key={chip}>{chip}</span>
                ))}
              </div>
              {promptSeed.coachFocus.slice(0, 2).map((focus) => (
                <div className={styles.strategyItem} key={focus}>
                  <span className={styles.dot} />
                  <span>{focus}</span>
                </div>
              ))}
              <div className={styles.promptCard}>
                <div className={styles.sectionHeader}>
                  <Coffee size={15} />
                  Success example
                </div>
                <div className={styles.promptLine}>{promptSeed.suggestedOpener}</div>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className={styles.footer}>
        <button className={styles.primaryButton} onClick={onStartPractice}>
          <Mic2 size={18} />
          {startButtonText}
        </button>
      </div>
    </div>
  );
}
