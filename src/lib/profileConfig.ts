export const PROFILE_CONSTANTS = {
  defaultUserName: "Member",
  actorSinceLabel: "Actor since 2026",
  homeGreeting: "Welcome back",
  homeActiveDays: "10 days",
  homePoints: "14,000",
  profileStats: ["10 days", "Sapphire", "14,000", "95min"] as const,
} as const;

const USER_NAME_STORAGE_KEY = "uply.userName";

export function normalizeUserName(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return PROFILE_CONSTANTS.defaultUserName;

  // If login input is an email, use the local part as display name.
  const at = trimmed.indexOf("@");
  if (at > 0) return trimmed.slice(0, at);

  return trimmed;
}

export function loadStoredUserName(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(USER_NAME_STORAGE_KEY);
  if (!value) return null;
  const normalized = value.trim();
  return normalized || null;
}

export function persistUserName(name: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeUserName(name);
  window.localStorage.setItem(USER_NAME_STORAGE_KEY, normalized);
}
