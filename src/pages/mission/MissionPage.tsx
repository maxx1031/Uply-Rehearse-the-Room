import { useState } from "react";
import { ChevronDown, ChevronLeft, Coffee, Mic2, Sparkles, Target } from "lucide-react";
import {
  buildDefaultOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboardingProfile";
import { type IntroMemory, type LessonConfig } from "@/lib/selfIntroCourse";
import styles from "./MissionPage.module.css";

interface MissionPageProps {
  profile?: OnboardingProfile | null;
  lesson?: LessonConfig;
  memory?: IntroMemory;
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
  lesson,
  memory,
  missionLabel,
  missionTitle,
  missionSubtitle,
  partnerName,
  partnerRole,
  partnerStyle,
  sceneLabel,
  taskTitle,
  taskDescription,
  taskHint,
  startButtonText,
  onBack,
  onStartPractice,
}: MissionPageProps) {
  void memory;
  const [expanded, setExpanded] = useState(false);
  const activeProfile = profile ?? buildDefaultOnboardingProfile();
  const promptSeed = activeProfile.firstLessonPromptSeed;
  const resolvedMissionLabel = lesson ? `LEVEL ${lesson.level} REHEARSAL` : missionLabel ?? "TODAY'S MISSION";
  const resolvedMissionTitle = lesson?.title ?? missionTitle ?? promptSeed.sceneTitle;
  const resolvedMissionSubtitle = lesson?.subtitle ?? missionSubtitle;
  const resolvedPartnerName = partnerName ?? promptSeed.partnerName;
  const resolvedPartnerRole = partnerRole ?? promptSeed.partnerRole;
  const resolvedPartnerStyle = partnerStyle ?? promptSeed.partnerStyle;
  const resolvedSceneLabel = sceneLabel ?? (lesson && lesson.level <= 3 ? "Orientation chat" : "Alumni chat");
  const resolvedTaskTitle = taskTitle ?? "Today's task";
  const resolvedTaskDescription = lesson?.userTask ?? taskDescription ?? activeProfile.selectedGoal.personalObjective;
  const resolvedTaskHint = lesson?.supportLabel ?? taskHint ?? activeProfile.selectedGoal.title;
  const resolvedStartButtonText = startButtonText ?? "Start rehearsal";

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button className={styles.iconButton} onClick={onBack} aria-label="Back to home">
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div>
          <div className={styles.eyebrow}>{resolvedMissionLabel}</div>
          <div className={styles.title}>{resolvedMissionTitle}</div>
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
              <div className={styles.partnerName}>{resolvedPartnerName}</div>
              <div className={styles.partnerRole}>{resolvedPartnerRole}</div>
            </div>
          </div>
          {resolvedMissionSubtitle ? <div className={styles.mutedText}>{resolvedMissionSubtitle}</div> : null}

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Scene</div>
              <div className={styles.metaValue}>{resolvedSceneLabel}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Style</div>
              <div className={styles.metaValue}>{resolvedPartnerStyle}</div>
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
            {resolvedTaskTitle}
          </div>
          <div className={styles.bodyText}>{resolvedTaskDescription}</div>
          <div className={styles.mutedText}>{resolvedTaskHint}</div>
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
          {resolvedStartButtonText}
        </button>
      </div>
    </div>
  );
}
