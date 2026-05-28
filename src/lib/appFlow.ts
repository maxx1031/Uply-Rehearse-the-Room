export type Step =
  | "splash" | "ticket" | "login" | "curtain"
  | "after-party" | "conversation"
  | "analyzing" | "result" | "reflection"
  | "goal" | "slogan" | "home"
  | "profile"
  | "mission" | "practice" | "mission-complete" | "review";

export const VALID_STEPS: Step[] = [
  "splash", "ticket", "login", "curtain",
  "after-party", "conversation",
  "analyzing", "result", "reflection",
  "goal", "slogan", "home",
  "profile",
  "mission", "practice", "mission-complete", "review",
];

export function readStepFromUrl(): Step {
  if (typeof window === "undefined") return "splash";
  const param = new URLSearchParams(window.location.search).get("step");
  return (VALID_STEPS as string[]).includes(param ?? "") ? (param as Step) : "splash";
}

export function isStepLocked(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("lockStep") === "1";
}

export function isDebugModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "1";
}
