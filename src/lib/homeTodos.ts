export const DEFAULT_HOME_TODOS = [
  "Review one LinkedIn opener before noon",
  "Send one warm follow-up message after coffee chat",
  "Draft a 3-line thank-you note for a mentor",
] as const;

export const HOME_TODO_STORAGE_KEY = "uply.review.todos";

export function resetHomeTodos(): void {
  if (typeof window === "undefined") return;
  const todos = [...DEFAULT_HOME_TODOS];
  window.localStorage.setItem(HOME_TODO_STORAGE_KEY, JSON.stringify(todos));
  window.dispatchEvent(new CustomEvent("uply:todos-updated", { detail: todos }));
}
