import { useState } from "react";
import { Flame } from "lucide-react";
import {
  type MemoryCard,
  type PracticeSessionResult,
  type ReviewFeeling,
} from "@/lib/onboardingProfile";
import styles from "./ReviewPage.module.css";

interface ReviewPageProps {
  result: PracticeSessionResult;
  streak: number;
  onTryAgain: () => void;
  onDone: (card: MemoryCard) => void;
}

function id(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ReviewPage({ result, streak, onTryAgain, onDone }: ReviewPageProps) {
  const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
  const draft = result.reviewDraft;
  const showHighlight = draft.highlightQuote.trim().toLowerCase() !== draft.originalAsk.trim().toLowerCase();

  const done = () => {
    if (!feeling) return;
    onDone({
      id: id("memory"),
      sceneTitle: result.sceneTitle,
      partnerName: result.partnerName,
      createdAt: new Date().toISOString(),
      feeling,
      highlightQuote: draft.highlightQuote,
      highlightComment: draft.highlightComment,
      originalAsk: draft.originalAsk,
      rewriteAlternative: draft.alternative,
      scoreDelta: result.scoreDelta,
    });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.scorePill}>+{result.scoreDelta} · <Flame size={13} fill="currentColor" />{streak}</div>

      <section className={styles.feelingSection}>
        <h1>How did it feel?</h1>
        <div className={styles.feelingRow}>
          {(["good", "okay", "hard"] as ReviewFeeling[]).map((value) => (
            <button
              key={value}
              className={
                feeling === value
                  ? styles.feelingActive
                  : feeling
                  ? styles.feelingDisabled
                  : styles.feelingButton
              }
              onClick={() => setFeeling(value)}
              disabled={Boolean(feeling)}
            >
              {value === "good" ? "Good" : value === "okay" ? "Okay" : "Hard"}
            </button>
          ))}
        </div>
      </section>

      {feeling && (
        <div className={styles.reviewStack}>
          {showHighlight && (
            <section className={styles.card}>
              <div className={styles.eyebrow}>Your highlight</div>
              <blockquote>{draft.highlightQuote}</blockquote>
              <p>{draft.highlightComment}</p>
            </section>
          )}

          <section className={styles.card}>
            <div className={styles.eyebrow}>Try rewriting</div>
            <div className={styles.label}>You said</div>
            <blockquote>{draft.originalAsk}</blockquote>
            <p>{draft.contextNote}</p>
            <div className={styles.alternative}>{draft.alternative}</div>
          </section>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.secondaryButton} onClick={onTryAgain}>Try again</button>
        <button className={styles.primaryButton} onClick={done} disabled={!feeling}>Done</button>
      </div>
    </div>
  );
}
