import { useEffect } from "react";
import { Flame, Star } from "lucide-react";
import styles from "./MissionCompletePage.module.css";

interface MissionCompletePageProps {
  scoreDelta: number;
  streak: number;
  onDone: () => void;
}

export function MissionCompletePage({ scoreDelta, streak, onDone }: MissionCompletePageProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <button className={styles.screen} onClick={onDone} aria-label="Continue to review">
      <div className={styles.mark}><Star size={44} fill="currentColor" /></div>
      <div className={styles.title}>Mission Complete</div>
      <div className={styles.reward}>
        <span>+{scoreDelta} pts</span>
        <span><Flame size={16} fill="currentColor" />{streak}-day streak</span>
      </div>
      <div className={styles.hint}>tap anywhere to skip</div>
    </button>
  );
}
