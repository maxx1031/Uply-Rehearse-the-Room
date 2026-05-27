import { ChevronLeft, Coffee, Mic2, Target } from "lucide-react";
import jordanAvatar from "@/assets/imports/3-1.png";
import {
  buildDefaultOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboardingProfile";
import { type IntroMemory, type LessonConfig } from "@/lib/selfIntroCourse";
import styles from "./MissionPage.module.css";

interface MissionPageProps {
  profile?: OnboardingProfile | null;
  lesson: LessonConfig;
  memory: IntroMemory;
  onBack: () => void;
  onStartPractice: () => void;
}

export function MissionPage({ profile, lesson, memory, onBack, onStartPractice }: MissionPageProps) {
  void memory;
  const activeProfile = profile ?? buildDefaultOnboardingProfile();
  const promptSeed = activeProfile.firstLessonPromptSeed;

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button className={styles.iconButton} onClick={onBack} aria-label="Back to home">
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div>
          <div className={styles.eyebrow}>LEVEL {lesson.level} REHEARSAL</div>
          <div className={styles.title}>{lesson.title}</div>
        </div>
      </div>

      <div className={styles.stack}>
        <section className={styles.heroCard}>
          <div className={styles.heroVisual} aria-hidden="true">
            <Coffee size={48} strokeWidth={1.8} />
          </div>
          <div className={styles.partnerRow}>
            <img className={styles.partnerAvatar} src={jordanAvatar} alt="" aria-hidden="true" />
            <div>
              <div className={styles.partnerName}>{promptSeed.partnerName}</div>
              <div className={styles.partnerRole}>{promptSeed.partnerRole}</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Target size={15} />
            Today's task
          </div>
          <div className={styles.bodyText}>{lesson.userTask}</div>
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
