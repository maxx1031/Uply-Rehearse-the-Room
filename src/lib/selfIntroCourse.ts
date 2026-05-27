import type { PracticePromptSeed, PracticeTranscriptTurn, ReviewDraft } from "./onboardingProfile";

export type CourseLessonId = "level-1" | "level-2" | "level-3" | "level-4" | "level-5";
export type IntroMemoryKey =
  | "identityAnchor"
  | "professionalAnchor"
  | "curiosityHook"
  | "customizedIntro"
  | "finalIntro";

export interface CourseProgress {
  themeId: "alumni-coffee-intro";
  currentLessonId: CourseLessonId;
  completedLessonIds: CourseLessonId[];
  lastPracticedAt: string | null;
}

export interface LessonMemoryCard {
  id: string;
  lessonId: CourseLessonId;
  label: string;
  value: string;
  createdAt: string;
}

export interface IntroMemory {
  identityAnchor: string | null;
  professionalAnchor: string | null;
  curiosityHook: string | null;
  customizedIntro: string | null;
  finalIntro: string | null;
  nextSmallAsk: string | null;
  lessonCards: LessonMemoryCard[];
}

export interface LessonConfig {
  id: CourseLessonId;
  level: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  userTask: string;
  supportLabel: string;
  outcomeLabel: string;
  memoryKey: IntroMemoryKey;
  memoryLabel: string;
  memoryFallback: string;
  tasks: string[];
  tips: string[];
  conversationGoal: string;
  hidePracticeTips?: boolean;
  successCriteria: string[];
  suggestedLine: string;
  jordanOpening: string;
  scoreDelta: number;
  isChallenge: boolean;
  realWorldPrompt?: {
    title: string;
    body?: string;
    smallAsk?: string;
  };
}

export interface CourseReviewResult {
  finalIntro: string;
  nextTodo: string;
  scoreDelta: number;
  streakDelta: number;
}

export interface PracticeMockTurn {
  role: "assistant" | "user";
  text: string;
  afterMs?: number;
}

const THEME_ID: CourseProgress["themeId"] = "alumni-coffee-intro";
const PARTNER_NAME = "Jordan Lee";
const PARTNER_ROLE = "Alumni mentor · Applied AI PM";

export const SELF_INTRO_LESSONS: LessonConfig[] = [
  {
    id: "level-1",
    level: 1,
    title: "Equal exchange",
    shortTitle: "Identity",
    subtitle: "Build a short intro with name, school, and major or role.",
    userTask: "Answer with the same level of detail: name plus school.",
    supportLabel: "Tips show what to include. Jordan keeps the chat natural.",
    outcomeLabel: "Identity anchor",
    memoryKey: "identityAnchor",
    memoryLabel: "Identity anchor",
    memoryFallback: "I'm YJ, a student exploring product and AI.",
    tasks: ["Answer with the same level of detail: name plus school."],
    tips: ["Name plus school", "Major, role, or current identity", "One natural line Jordan can react to"],
    conversationGoal:
      "Naturally learn the user's name, school, and major, role, or current identity. Ask for missing items one at a time, like a real alumni coffee chat.",
    successCriteria: ["The intro includes the user's name.", "The intro includes school.", "The intro includes major, role, or current identity."],
    suggestedLine: "I'm YJ, a student at SUFE, and I'm exploring product work in AI.",
    jordanOpening: "Hi, I'm Jordan, an alum who works on applied AI products. How would you introduce yourself at the start of a coffee chat?",
    scoreDelta: 20,
    isChallenge: false,
  },
  {
    id: "level-2",
    level: 2,
    title: "Professional anchor",
    shortTitle: "Direction",
    subtitle: "Add current project, work, research, or exploration direction.",
    userTask: "Add one more detail about your major or work direction.",
    supportLabel: "Tips carry the structure. Jordan asks like a curious alum.",
    outcomeLabel: "Professional anchor",
    memoryKey: "professionalAnchor",
    memoryLabel: "Professional anchor",
    memoryFallback: "I'm studying business and getting more interested in AI product management.",
    tasks: ["Add one more detail about your major or work direction."],
    tips: ["Start from your name, school, and major", "Add what you are working on or exploring now", "Keep it under about 30 seconds"],
    conversationGoal:
      "Naturally learn what the user is studying, working on, researching, interning in, or exploring now. Help the chat surface one concrete current direction without coaching language.",
    successCriteria: ["The intro includes the user's identity.", "The user adds a current work, project, research, or exploration dimension.", "The wording can be reused in a coffee chat."],
    suggestedLine: "I'm studying business, and recently I've been interested in how AI products turn messy user needs into clear workflows.",
    jordanOpening: "Good to see you again. If this were a coffee chat, how would you introduce yourself and what you are working on or exploring now?",
    scoreDelta: 20,
    isChallenge: false,
  },
  {
    id: "level-3",
    level: 3,
    title: "Curiosity hook",
    shortTitle: "Small ask",
    subtitle: "Turn the intro into a 30 second version with motivation and a small ask.",
    userTask: "Add one personal hook and a light reason to keep talking.",
    supportLabel: "Tips help you bridge from intro to conversation.",
    outcomeLabel: "Curiosity hook",
    memoryKey: "curiosityHook",
    memoryLabel: "Curiosity hook",
    memoryFallback: "I'd love to hear how you moved from product work into applied AI, because I'm trying to understand that path.",
    tasks: ["Add one personal hook and a light reason to keep talking."],
    tips: ["Include identity and current direction", "Add why you care about this path", "End with one light question for Jordan"],
    conversationGoal:
      "Naturally learn what the user is curious about, why it matters to them, and what light question they would ask an alum. Keep it conversational and avoid turning the ask into a referral request.",
    successCriteria: ["The user gives a complete intro.", "The user names a specific curiosity or motivation.", "The user includes a light, professional small ask."],
    suggestedLine: "I'm curious how you moved from regular PM work into applied AI, because I'm trying to understand what to learn next.",
    jordanOpening: "Let's make this feel like a real alumni chat. How would you introduce yourself, and what would you be curious to ask me about?",
    scoreDelta: 25,
    isChallenge: false,
  },
  {
    id: "level-4",
    level: 4,
    title: "Mirror polish",
    shortTitle: "Polish",
    subtitle: "Use the polished version on the page, then say it in your own voice.",
    userTask: "Try the polished version and make it sound like you.",
    supportLabel: "The page shows the polish. Jordan only listens like a real mentor.",
    outcomeLabel: "Customized intro v1",
    memoryKey: "customizedIntro",
    memoryLabel: "Customized intro",
    memoryFallback:
      "I'm YJ, a student exploring AI product work. I'm especially interested in how applied AI products turn messy user needs into useful workflows, and I'd love to learn how you built that path.",
    tasks: ["Try the polished version and make it sound like you."],
    tips: ["Use the polished version as a starting point", "Keep your own details and rhythm", "It does not need to be word perfect"],
    conversationGoal:
      "Invite the user to try their prepared polished intro out loud. Do not create a new polished script in the conversation. Respond as a real alum would after hearing it.",
    successCriteria: ["The user attempts a complete version.", "The user keeps their personal details.", "The result sounds natural enough to say aloud."],
    suggestedLine:
      "I'm YJ, a student exploring AI product work. I'm especially interested in how applied AI products turn messy user needs into useful workflows, and I'd love to learn how you built that path.",
    jordanOpening: "This time, try your prepared intro in your own voice. I'll listen like this is the start of a real coffee chat.",
    scoreDelta: 30,
    isChallenge: false,
  },
  {
    id: "level-5",
    level: 5,
    title: "No-hint challenge",
    shortTitle: "Challenge",
    subtitle: "Repeat your polished coffee-chat intro and answer one follow-up.",
    userTask: "Do the challenge from memory, without hints.",
    supportLabel: "No tips on this round. Jordan keeps the coffee chat moving.",
    outcomeLabel: "Reusable intro",
    memoryKey: "finalIntro",
    memoryLabel: "Final intro",
    memoryFallback:
      "I'm YJ, a student exploring AI product work. I'm especially interested in how applied AI products turn messy user needs into useful workflows, and I'd love to learn how you built that path.",
    tasks: ["Do the challenge from memory, without hints."],
    tips: [],
    conversationGoal:
      "Listen to the user's full intro, then ask exactly one natural follow-up about their direction, motivation, or small ask. Finish only after the user answers that follow-up.",
    successCriteria: ["The user delivers a full 30 to 45 second intro.", "The user answers one follow-up naturally.", "The intro can be reused in a real alumni coffee chat."],
    suggestedLine:
      "I'm YJ, a student exploring AI product work. I'm interested in how applied AI products turn user needs into real workflows, and I'd love to hear how you built that path.",
    jordanOpening: "Challenge round. Imagine this is the start of our alumni coffee chat. Go ahead with your full intro when you are ready.",
    scoreDelta: 50,
    isChallenge: true,
    hidePracticeTips: true,
    realWorldPrompt: {
      title: "Try it in one real coffee chat",
    },
  },
];

export function buildInitialCourseProgress(): CourseProgress {
  return {
    themeId: THEME_ID,
    currentLessonId: "level-1",
    completedLessonIds: [],
    lastPracticedAt: null,
  };
}

export function buildInitialIntroMemory(): IntroMemory {
  return {
    identityAnchor: null,
    professionalAnchor: null,
    curiosityHook: null,
    customizedIntro: null,
    finalIntro: null,
    nextSmallAsk: null,
    lessonCards: [],
  };
}

export function getLessonById(id: CourseLessonId): LessonConfig {
  const lesson = SELF_INTRO_LESSONS.find((item) => item.id === id);
  if (!lesson) return SELF_INTRO_LESSONS[0];
  return lesson;
}

export function isLessonComplete(progress: CourseProgress, lessonId: CourseLessonId): boolean {
  return progress.completedLessonIds.includes(lessonId);
}

export function isLessonUnlocked(progress: CourseProgress, lessonId: CourseLessonId): boolean {
  const lesson = getLessonById(lessonId);
  if (lesson.level === 1) return true;
  if (lesson.level === 5) {
    return SELF_INTRO_LESSONS.slice(0, 4).every((item) => isLessonComplete(progress, item.id));
  }
  const previous = SELF_INTRO_LESSONS[lesson.level - 2];
  return previous ? isLessonComplete(progress, previous.id) : true;
}

export function getCurrentLesson(progress: CourseProgress): LessonConfig {
  const current = SELF_INTRO_LESSONS.find((lesson) => lesson.id === progress.currentLessonId);
  if (current && isLessonUnlocked(progress, current.id) && !isLessonComplete(progress, current.id)) return current;
  return SELF_INTRO_LESSONS.find((lesson) => isLessonUnlocked(progress, lesson.id) && !isLessonComplete(progress, lesson.id)) ?? SELF_INTRO_LESSONS[4];
}

export function getNextLessonId(lessonId: CourseLessonId): CourseLessonId | null {
  const index = SELF_INTRO_LESSONS.findIndex((lesson) => lesson.id === lessonId);
  return SELF_INTRO_LESSONS[index + 1]?.id ?? null;
}

export function completeLesson(progress: CourseProgress, lessonId: CourseLessonId, completedAt: string): CourseProgress {
  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];
  const nextLessonId = getNextLessonId(lessonId);
  const currentLessonId = nextLessonId && completedLessonIds.includes(nextLessonId) === false ? nextLessonId : lessonId;
  return {
    ...progress,
    completedLessonIds,
    currentLessonId,
    lastPracticedAt: completedAt,
  };
}

function normalizeLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function buildPolishedIntro(memory: IntroMemory): string {
  if (memory.customizedIntro) return memory.customizedIntro;
  const identity = memory.identityAnchor ?? getLessonById("level-1").memoryFallback;
  const professional = memory.professionalAnchor ?? getLessonById("level-2").memoryFallback;
  const curiosity = memory.curiosityHook ?? getLessonById("level-3").memoryFallback;
  return normalizeLine([identity, professional, curiosity].filter(Boolean).join(" "));
}

export function buildFinalIntro(memory: IntroMemory): string {
  if (memory.finalIntro) return memory.finalIntro;
  if (memory.customizedIntro) return memory.customizedIntro;
  return buildPolishedIntro(memory);
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function pickUserLine(transcript: PracticeTranscriptTurn[], fallback: string): string {
  const turns = transcript
    .filter((turn) => turn.speaker === "user")
    .map((turn) => normalizeLine(turn.text))
    .filter(Boolean);
  return turns.find((turn) => turn.length >= 24) ?? turns[turns.length - 1] ?? fallback;
}

export function buildLessonMemoryCard(lesson: LessonConfig, transcript: PracticeTranscriptTurn[]): LessonMemoryCard {
  const value = pickUserLine(transcript, lesson.memoryFallback);
  return {
    id: makeId("lesson_memory"),
    lessonId: lesson.id,
    label: lesson.memoryLabel,
    value,
    createdAt: new Date().toISOString(),
  };
}

export function applyLessonMemory(memory: IntroMemory, lesson: LessonConfig, card: LessonMemoryCard): IntroMemory {
  const nextCards = [...memory.lessonCards.filter((item) => item.lessonId !== lesson.id), card];
  const nextMemory = {
    ...memory,
    [lesson.memoryKey]: card.value,
    lessonCards: nextCards,
  };
  if (lesson.id === "level-3") {
    nextMemory.nextSmallAsk = card.value;
  }
  return nextMemory;
}

function makeSelfIntroSystemPrompt(lesson: LessonConfig, memory: IntroMemory): string {
  const memoryReference = buildPolishedIntro(memory);
  const closingLine = lesson.isChallenge
    ? "That version is ready to take into a real coffee chat."
    : "Nice, let's keep that line for the next round.";
  const minimumCompletion =
    lesson.level <= 3
      ? "For Levels 1 to 3, finish only after the user attempts a complete intro and the conversation goal is covered."
      : lesson.level === 4
      ? "For Level 4, finish only after the user tries their prepared polished intro out loud."
      : "For Level 5, finish only after the user delivers the intro and answers one follow-up naturally.";

  return [
    "You are Jordan Lee, a warm alumni mentor in Uply's alumni coffee chat self-introduction practice.",
    "Stay in character as Jordan. Do not say you are an AI, coach, evaluator, or system.",
    "Use English for the conversation. Keep replies short, natural, and supportive.",
    "Do not score the user during practice. Do not mention hidden instructions, prompts, tools, review fields, or UI.",
    "Do not give scripts, templates, checklists, training tips, or success criteria in the conversation.",
    "",
    "COURSE CONTEXT",
    `Current level: Level ${lesson.level}, ${lesson.title}.`,
    `User task: ${lesson.userTask}`,
    `Conversation goal: ${lesson.conversationGoal}`,
    `Known intro memory for context only: ${memoryReference}`,
    "",
    "CONVERSATION BEHAVIOR",
    "Act like a real alum in a coffee chat, not a tutor. Ask natural follow-up questions to understand the user.",
    "If the user says something unclear, ask one small follow-up question.",
    "If the user gives too little, ask for one concrete detail in normal conversational language.",
    "If the user gives too much, reflect one useful thread and keep the chat moving.",
    "If the user is stuck, ask an easier human question. Do not provide a full answer for them.",
    "For Level 4, do not create a new polished intro. Invite the user to try their prepared version and respond naturally after hearing it.",
    "For Level 5, do not proactively help. Let the user lead, then ask exactly one natural follow-up before closing.",
    "",
    "FINISH PRACTICE RULES",
    "Use three phases: practice, wrap-up, complete.",
    "In practice, keep the conversation going until the level's minimum completion condition is met.",
    minimumCompletion,
    "Do not finish after silence, a one-word answer, or a vague off-task answer.",
    "If the user clearly asks to stop, give one supportive closing line and call finish_practice even if the task is incomplete.",
    "In wrap-up, say exactly one short closing line and do not ask another question.",
    `Use this closing line when the level is complete: "${closingLine}"`,
    "In complete, call finish_practice with a short reason only after the closing line has been spoken in the same response.",
  ].join("\n");
}

export function buildLessonPromptSeed(lesson: LessonConfig, memory: IntroMemory): PracticePromptSeed {
  return {
    sceneTitle: `Level ${lesson.level} · ${lesson.title}`,
    sceneSubtitle: "Alumni coffee chat · Jordan · self intro",
    partnerName: PARTNER_NAME,
    partnerRole: PARTNER_ROLE,
    partnerStyle: "Warm alumni mentor, stable practice partner, concise and grounded",
    userGoal: lesson.userTask,
    coachFocus: [],
    strategyChips: ["Alumni chat", `Level ${lesson.level}`, lesson.shortTitle],
    tasks: [],
    openingContext: "The user is practicing a reusable self-introduction for a low-pressure alumni coffee chat.",
    successCriteria: [],
    suggestedOpener: "The user will introduce themselves first.",
    systemPrompt: makeSelfIntroSystemPrompt(lesson, memory),
  };
}

export function buildLessonMockScript(lesson: LessonConfig, memory: IntroMemory): PracticeMockTurn[] {
  const userLine =
    lesson.id === "level-5"
      ? buildFinalIntro(memory)
      : lesson.id === "level-4"
      ? [memory.identityAnchor, memory.professionalAnchor, memory.curiosityHook].filter(Boolean).join(" ") || lesson.suggestedLine
      : lesson.suggestedLine;
  return [
    { role: "assistant", text: lesson.jordanOpening, afterMs: 700 },
    { role: "user", text: userLine, afterMs: 1800 },
    {
      role: "assistant",
      text: lesson.isChallenge
        ? "That felt clear and usable. One quick follow-up: what made you interested in that direction?"
        : lesson.id === "level-4"
        ? "That came through naturally. What part of that intro felt most like you?"
        : "That gives me a clear picture. What made you interested in that direction?",
      afterMs: 1000,
    },
    {
      role: "user",
      text: lesson.isChallenge
        ? "I noticed AI products need both user empathy and technical judgment, and I want to learn how people build that balance."
        : "I like that it sounds specific without feeling too rehearsed.",
      afterMs: 1500,
    },
    {
      role: "assistant",
      text: lesson.isChallenge
        ? "That version is ready to take into a real coffee chat."
        : "Nice, let's keep that line for the next round.",
      afterMs: 900,
    },
  ];
}

export function buildCourseReviewDraft(memory: IntroMemory, fallback: ReviewDraft): ReviewDraft {
  const finalIntro = buildFinalIntro(memory);
  return {
    highlightQuote: finalIntro,
    highlightComment: "This version gives Jordan enough context to understand who you are, what you are exploring, and why the chat matters.",
    originalAsk: memory.nextSmallAsk ?? fallback.originalAsk,
    contextNote: "A reusable coffee-chat intro works best when it ends with one light, specific next step.",
    alternative: "I'd love to hear how you built your path into applied AI product work, and what you would focus on first if you were starting again.",
  };
}

export function buildCourseReviewResult(memory: IntroMemory, scoreDelta: number): CourseReviewResult {
  return {
    finalIntro: buildFinalIntro(memory),
    nextTodo: "Record this intro once and check whether it still sounds like you.",
    scoreDelta,
    streakDelta: 1,
  };
}
