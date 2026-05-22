// Temporary store for the Maya conversation, kept for later user analysis.
// Lives in memory and mirrors to sessionStorage so a reload within the same
// tab keeps the transcript. Cleared when the tab closes — this is scratch data,
// not durable storage. Swap the sink here when a real backend exists.

export interface ConversationTurn {
  role: "user" | "maya";
  text: string;
  ts: number;
}

const STORAGE_KEY = "uply.conversation";

function read(): ConversationTurn[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConversationTurn[]) : [];
  } catch {
    return [];
  }
}

function write(turns: ConversationTurn[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns));
  } catch {
    // sessionStorage full or unavailable — drop silently; in-memory analysis
    // can still read what it captured this session.
  }
}

/** Append a turn. Skips empties and collapses an immediate duplicate (e.g. a
 *  delta-built bubble followed by the matching completed event). */
export function logTurn(role: ConversationTurn["role"], text: string): void {
  const clean = text.trim();
  if (!clean) return;
  const turns = read();
  const last = turns[turns.length - 1];
  if (last && last.role === role && last.text === clean) return;
  turns.push({ role, text: clean, ts: Date.now() });
  write(turns);
}

export function getConversation(): ConversationTurn[] {
  return read();
}

export function clearConversation(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
