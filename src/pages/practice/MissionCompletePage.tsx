import { Flame } from "lucide-react";
import diamondImg from "@/assets/imports/3.png";
import styles from "./MissionCompletePage.module.css";

interface RealWorldPrompt {
  title: string;
  body?: string;
  smallAsk?: string;
}

interface MissionCompletePageProps {
  scoreDelta: number;
  variant?: "lesson" | "challenge";
  title?: string;
  subtitle?: string;
  realWorldPrompt?: RealWorldPrompt;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

export function MissionCompletePage({
  scoreDelta,
  variant = "lesson",
  title = "Level Complete",
  subtitle = "",
  realWorldPrompt,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: MissionCompletePageProps) {
  const hasSecondaryAction = Boolean(secondaryLabel && onSecondary);
  const isChallenge = variant === "challenge";

  return (
    <div className={styles.screen}>
      <div className={`${styles.card} ${isChallenge ? styles.challengeCard : ""}`}>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        <div className={styles.reward}>
          <span className={styles.gemReward}>
            <img src={diamondImg} alt="" aria-hidden />
            +{scoreDelta}
          </span>
          <span><Flame size={22} fill="currentColor" />streak +1</span>
        </div>
        {realWorldPrompt ? (
          <div className={styles.realWorldPrompt}>
            <div className={styles.realWorldTitle}>{realWorldPrompt.title}</div>
            {realWorldPrompt.body ? <div className={styles.realWorldBody}>{realWorldPrompt.body}</div> : null}
            {realWorldPrompt.smallAsk ? <div className={styles.realWorldAsk}>{realWorldPrompt.smallAsk}</div> : null}
          </div>
        ) : null}
        <div className={`${styles.actions} ${hasSecondaryAction ? "" : styles.singleAction}`}>
          {hasSecondaryAction ? <button className={styles.secondaryButton} onClick={onSecondary}>{secondaryLabel}</button> : null}
          <button className={styles.primaryButton} onClick={onPrimary}>{primaryLabel}</button>
        </div>
      </div>
    </div>
  );
}
