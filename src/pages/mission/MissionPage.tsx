import { useState } from "react";
import { ChevronDown, ChevronLeft, Coffee, Mic2, Sparkles, Target, UserRound } from "lucide-react";
import {
  buildDefaultOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboardingProfile";
import styles from "./MissionPage.module.css";

interface MissionPageProps {
  profile?: OnboardingProfile | null;
  onBack: () => void;
  onStartPractice: () => void;
}

export function MissionPage({ profile, onBack, onStartPractice }: MissionPageProps) {
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
          <div className={styles.eyebrow}>TODAY'S MISSION</div>
          <div className={styles.title}>{promptSeed.sceneTitle}</div>
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
              <div className={styles.partnerName}>{promptSeed.partnerName}</div>
              <div className={styles.partnerRole}>{promptSeed.partnerRole}</div>
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Scene</div>
              <div className={styles.metaValue}>Coffee chat</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Style</div>
              <div className={styles.metaValue}>Gentle</div>
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
            Personal goal
          </div>
          <div className={styles.bodyText}>{activeProfile.selectedGoal.personalObjective}</div>
          <div className={styles.mutedText}>{activeProfile.selectedGoal.title}</div>
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

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <UserRound size={15} />
            Prompt seed
          </div>
          <div className={styles.promptLine}>{promptSeed.openingContext}</div>
        </section>
      </div>

      <div className={styles.footer}>
        <button className={styles.primaryButton} onClick={onStartPractice}>
          <Mic2 size={18} />
          Curtain up
        </button>
      </div>
    </div>
  );
}
