/**
 * Uply Onboarding — Flow router
 *
 * This is a reference example showing how to wire the modules together
 * AFTER your existing ticket / curtain screens. Drop into your App as
 * a sub-route, or inline these handlers into your own state machine.
 *
 * Linear flow:
 *   ┌────── ACT I ──────┐  ┌──── INTERLUDE ────┐  ┌──── EPILOGUE ─────┐
 *   stage → conversation → analyzing → result → reflection → goal → slogan → home
 *
 * Branching from your existing app:
 *   <CurtainScreen onDone={() => start("stage")} />
 *   → mount this component, listen for `onFinish(user, goalId)` to hand
 *     off to your homepage / next route.
 */
import { useState } from "react";

import { StageScreen, ConversationScreen } from "@/pages/act-i/ActI";
import {
  AnalyzingScreen, ResultScreen, ReflectionScreen,
  ArchetypeId, ReflectionBucket,
} from "@/pages/interlude/Interlude";
import { GoalScreen, SloganScreen, HomeScreen, GoalId, User } from "@/pages/epilogue/Epilogue";

export type OnboardingStep =
  | "stage"        // ACT I — illustrated after-party scene
  | "conversation" // ACT I — dialogue with Maya
  | "analyzing"    // INTERLUDE — reviewing the tape
  | "result"       // INTERLUDE — archetype reveal
  | "reflection"   // INTERLUDE — does this match the real you?
  | "goal"         // EPILOGUE — pick first social scene
  | "slogan"       // EPILOGUE — curtain-call slogan
  | "home";        // EPILOGUE — landing

export interface UplyOnboardingFlowProps {
  /** Starting step (default: "stage"). Use this when wiring into your existing
   *  splash → ticket → curtain pipeline — hand off here after the curtain. */
  initialStep?: OnboardingStep;
  /** Already-authenticated user payload. Drives the home greeting. */
  user?: User;
  /** Optional override of which archetype to reveal on the Result screen.
   *  In production you'd compute this from the conversation choices. */
  resolveArchetype?: () => ArchetypeId;
  /** Called when the user reaches the homepage's Start Scene 1 button
   *  (or call your own `onRestart` route from HomeScreen). */
  onFinish?: (result: { user?: User; goalId?: GoalId; bucket?: ReflectionBucket; archetype: ArchetypeId }) => void;
}

export default function UplyOnboardingFlow({
  initialStep = "stage",
  user,
  resolveArchetype = () => "quiet-observer",
  onFinish,
}: UplyOnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [goalId, setGoalId] = useState<GoalId | undefined>();
  const [bucket, setBucket] = useState<ReflectionBucket | undefined>();
  const archetype = resolveArchetype();

  const go = (next: OnboardingStep) => setStep(next);

  switch (step) {
    case "stage":
      return <StageScreen onMicTap={() => go("conversation")} />;
    case "conversation":
      return <ConversationScreen
        onComplete={() => go("analyzing")}
        onSkip={() => go("analyzing")}
      />;
    case "analyzing":
      return <AnalyzingScreen onDone={() => go("result")} />;
    case "result":
      return <ResultScreen archetypeId={archetype} onContinue={() => go("reflection")} />;
    case "reflection":
      return <ReflectionScreen onContinue={(b) => { setBucket(b); go("goal"); }} />;
    case "goal":
      return <GoalScreen onPick={(g) => { setGoalId(g); go("slogan"); }} />;
    case "slogan":
      return <SloganScreen onDone={() => {
        if (onFinish) onFinish({ user, goalId, bucket, archetype });
        else go("home");
      }} />;
    case "home":
      return <HomeScreen user={user} onRestart={() => go("stage")} onStartMission={() => go("stage")} />;
  }
}

/* ─────────────────────────────────────────────────────────────
 * Minimal integration example (TypeScript)
 *
 *   // 1) in your app entry
 *   import "./uply/styles.css";
 *
 *   // 2) inside your existing App, after CurtainScreen finishes:
 *   {step === "curtain" && (
 *     <CurtainScreen onDone={() => setStep("onboarding")} />
 *   )}
 *   {step === "onboarding" && (
 *     <UplyOnboardingFlow
 *       user={{ name: registeredName }}
 *       resolveArchetype={() => computeArchetype(answers)}
 *       onFinish={({ goalId, bucket, archetype }) => {
 *         // persist + route to your real homepage
 *         api.saveOnboarding({ goalId, bucket, archetype });
 *         router.push("/home");
 *       }}
 *     />
 *   )}
 *
 * Each screen is exported individually too (see Act I / Interlude / Epilogue
 * source) — you can route them yourself if you want a different graph.
 * ───────────────────────────────────────────────────────────── */
