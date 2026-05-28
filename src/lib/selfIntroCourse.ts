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
  // 历史字段名保留, 语义在新课程里装的是"爱好 (hobby)"。
  curiosityHook: string | null;
  customizedIntro: string | null;
  finalIntro: string | null;
  nextSmallAsk: string | null;
  lessonCards: LessonMemoryCard[];
}

export type Persona = {
  name: string;
  shortLabel: string;
  displayRole: string;
  bio: readonly string[];
  voice: string;
  contextLine: string;
  hobby: string;
  socialHook: string;
};

export type LessonPersona = Persona;

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
  partnerOpening: string;
  persona: Persona;
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

/**
 * Level 4 在 PracticePage 中间会以"提示卡"形式显示这段文本, 让用户照着念。
 * mock 模式下 Level 4 user turn 直接使用这段文本。
 */
export const LEVEL_4_USER_TEMPLATE =
  "I'm Max, a Computer Science student at Dartmouth College. My research focuses on computer vision, using AI tools to generate human body motion. Outside of class I'm into Brazilian jiu-jitsu and CrossFit.";

export const LUNA_PERSONA: Persona = {
  name: "Luna",
  shortLabel: "Luna",
  displayRole: "UBC student",
  bio: [
    "A student at UBC.",
    "You are at a new-semester orientation mingle in Vancouver, bumping into students from other schools.",
    "You remember what it's like to feel new at these things and you keep things short and warm.",
  ],
  voice: "Warm, chatty, easy. Like a UBC classmate you just met in line for coffee.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver. Not an interview, not a class, not a coaching session.",
  hobby: "—",
  socialHook: "—",
};

export const THEO_PERSONA: Persona = {
  name: "Theo",
  shortLabel: "Theo",
  displayRole: "SFU · Communications + Interactive Arts",
  bio: [
    "A student at SFU, majoring in Communications + Interactive Arts.",
    "You are at a new-semester orientation mingle in Vancouver, bumping into students from other schools.",
  ],
  voice: "More talkative than average, small curious questions. Like a chatty SFU classmate.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver. Not an interview, not a class.",
  hobby: "—",
  socialHook: "—",
};

export const MAYA_PERSONA: Persona = {
  name: "Maya",
  shortLabel: "Maya",
  displayRole: "Emily Carr · Industrial Design",
  bio: [
    "A student at Emily Carr University, majoring in Industrial Design.",
    "Outside of school you are into ceramics, and you bike the seawall a lot.",
    "You are at a new-semester orientation mingle in Vancouver, bumping into students from other schools.",
  ],
  voice: "Thoughtful, a touch shy at first, warm once you get going. An Emily Carr classmate.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver. Not an interview, not a class.",
  hobby: "ceramics, and biking the seawall",
  socialHook: "—",
};

export const JORDAN_PERSONA: Persona = {
  name: "Jordan Lee",
  shortLabel: "Jordan",
  displayRole: "UC Berkeley alum · bouldering",
  bio: [
    "A young alum, about 1.5 years post-graduation from UC Berkeley.",
    "You majored in Cognitive Science.",
    "Outside of work you're really into bouldering.",
    "You are catching a quick coffee with someone right outside the office building.",
  ],
  voice: "Warm, lightly informal. Like a 24-year-old peer, not a manager.",
  contextLine:
    "A casual coffee chat with someone, right outside the office building. Not an interview, not a coaching session.",
  hobby: "bouldering",
  socialHook: "—",
};

export const SARA_PERSONA: Persona = {
  name: "Sara",
  shortLabel: "Sara",
  displayRole: "UCLA · Finance · surfing",
  bio: [
    "A young UCLA grad / early-career professional in finance.",
    "You majored in Finance at UCLA.",
    "Outside of work you surf as often as you can.",
    "You are catching a quick coffee with someone right outside the office building.",
  ],
  voice: "Warm, low-key confident. Talks like a peer, not a recruiter.",
  contextLine:
    "A casual coffee chat with someone, right outside the office building. Not an interview, not a coaching session.",
  hobby: "surfing",
  socialHook: "—",
};

export const SELF_INTRO_LESSONS: LessonConfig[] = [
  {
    id: "level-1",
    level: 1,
    title: "Equal exchange · name",
    shortTitle: "Name",
    subtitle: "Mirror back name plus school, one piece at a time.",
    userTask: "Answer with the same level of detail: name plus school.",
    supportLabel: "Mirror the same level of detail Luna gives.",
    outcomeLabel: "Identity anchor",
    memoryKey: "identityAnchor",
    memoryLabel: "Identity anchor",
    memoryFallback: "I'm Max, a student at Dartmouth.",
    tasks: ["Mirror name first, then school."],
    tips: ["Give your name when she asks", "When she shares her school, give yours"],
    conversationGoal:
      "Mirror exchange across two turns: get the user's name first, then their school. Nothing more.",
    successCriteria: ["The user shares their name.", "The user shares their school."],
    suggestedLine: "I'm Max, I go to Dartmouth.",
    partnerOpening: "Hey, I'm Luna. What's your name?",
    persona: LUNA_PERSONA,
    scoreDelta: 20,
    isChallenge: false,
  },
  {
    id: "level-2",
    level: 2,
    title: "Equal exchange · + school",
    shortTitle: "School",
    subtitle: "Mirror back name, school, and major, one piece at a time.",
    userTask: "Mirror back name, school, and major, one at a time.",
    supportLabel: "One piece per turn, just like Theo.",
    outcomeLabel: "Professional anchor",
    memoryKey: "professionalAnchor",
    memoryLabel: "Professional anchor",
    memoryFallback: "I'm at Dartmouth, studying Computer Science.",
    tasks: ["Mirror name first, then school, then major."],
    tips: ["Name when he asks", "School when he shares his", "Major when he shares his"],
    conversationGoal:
      "Mirror exchange across three turns: name → school → major. One dimension per assistant turn.",
    successCriteria: ["The user shares name.", "The user shares school.", "The user shares major."],
    suggestedLine: "I'm at Dartmouth, studying Computer Science.",
    partnerOpening: "Hey, I'm Theo. What's your name?",
    persona: THEO_PERSONA,
    scoreDelta: 20,
    isChallenge: false,
  },
  {
    id: "level-3",
    level: 3,
    title: "Equal exchange · + hobby",
    shortTitle: "Hobby",
    subtitle: "Mirror name, school, major, and hobby across four short turns.",
    userTask: "Mirror back name, school, major, and hobby.",
    supportLabel: "One dimension per turn, just like Maya.",
    outcomeLabel: "Hobby anchor",
    memoryKey: "curiosityHook",
    memoryLabel: "Hobby anchor",
    memoryFallback: "Outside of class I'm into Brazilian jiu-jitsu and CrossFit.",
    tasks: ["Mirror name → school → major → hobby."],
    tips: ["Name when she asks", "School when she shares hers", "Major when she shares hers", "Hobby when she shares hers"],
    conversationGoal:
      "Mirror exchange across four turns: name → school → major → hobby. One dimension per assistant turn.",
    successCriteria: ["The user shares name.", "The user shares school.", "The user shares major.", "The user shares hobby."],
    suggestedLine: "Outside of class I do Brazilian jiu-jitsu and CrossFit.",
    partnerOpening: "Hey, I'm Maya. What's your name?",
    persona: MAYA_PERSONA,
    scoreDelta: 25,
    isChallenge: false,
  },
  {
    id: "level-4",
    level: 4,
    title: "Polished intro · tips on screen",
    shortTitle: "Polish",
    subtitle: "Use the on-screen template to deliver a full four-piece intro in one go.",
    userTask: "Read the on-screen template and deliver a full four-piece intro in one go.",
    supportLabel: "Tips show your full intro. Just read it naturally.",
    outcomeLabel: "Customized intro v1",
    memoryKey: "customizedIntro",
    memoryLabel: "Customized intro",
    memoryFallback: LEVEL_4_USER_TEMPLATE,
    tasks: ["Deliver the full intro in one turn, all four details together."],
    tips: ["Use the on-screen template", "All four details in one turn", "Sound natural, not robotic"],
    conversationGoal:
      "Jordan opens with a complete four-piece intro and invites a complete intro back. After the user delivers, give one short affirmation and wrap up.",
    successCriteria: ["The user delivers all four details in one turn."],
    suggestedLine: LEVEL_4_USER_TEMPLATE,
    partnerOpening:
      "Hey, I'm Jordan. I'm a UC Berkeley alum, I studied Cognitive Science, and outside of work I'm really into bouldering. Tell me about yourself.",
    persona: JORDAN_PERSONA,
    scoreDelta: 30,
    isChallenge: false,
  },
  {
    id: "level-5",
    level: 5,
    title: "No-hint challenge",
    shortTitle: "Challenge",
    subtitle: "Deliver the full four-piece intro from memory, no hints.",
    userTask: "Do the full intro from memory, no hints.",
    supportLabel: "No hints. Deliver the full intro from memory.",
    outcomeLabel: "Reusable intro",
    memoryKey: "finalIntro",
    memoryLabel: "Final intro",
    memoryFallback: LEVEL_4_USER_TEMPLATE,
    tasks: ["Deliver the full intro from memory in one turn."],
    tips: [],
    conversationGoal:
      "Sara opens with a complete four-piece intro and invites a complete intro back. After the user delivers, give one short affirmation and wrap up. No follow-up question.",
    successCriteria: ["The user delivers all four details in one turn, from memory."],
    suggestedLine: LEVEL_4_USER_TEMPLATE,
    partnerOpening:
      "Hey, I'm Sara. I went to UCLA, studied Finance, and outside of work I surf as much as I can. Your turn — tell me about yourself.",
    persona: SARA_PERSONA,
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
  return SELF_INTRO_LESSONS.find((item) => item.id === id) ?? SELF_INTRO_LESSONS[0];
}

export function getLessonByCompletedLessons(completedLessons: number): LessonConfig {
  const clamped = Math.max(0, Math.min(4, Math.floor(completedLessons || 0)));
  return SELF_INTRO_LESSONS[clamped];
}

export function getLessonPersona(lessonId: CourseLessonId): Persona {
  return getLessonById(lessonId).persona;
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
  const currentLessonId = nextLessonId && !completedLessonIds.includes(nextLessonId) ? nextLessonId : lessonId;
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
  const hobby = memory.curiosityHook ?? getLessonById("level-3").memoryFallback;
  return normalizeLine([identity, professional, hobby].filter(Boolean).join(" "));
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
  const nextMemory: IntroMemory = {
    ...memory,
    [lesson.memoryKey]: card.value,
    lessonCards: nextCards,
  };
  return nextMemory;
}

/**
 * 每关 assistant 的逐字台词, 按 turn 顺序排列。
 * mock 模式直接用; real 模式把这些台词写进 system prompt, 让模型逐字 (或近乎逐字) 照念,
 * 避免发挥时产生重音 / 复读 / 偏题。
 */
const LESSON_ASSISTANT_LINES: Record<CourseLessonId, string[]> = {
  "level-1": [
    "Hey, I'm Luna. What's your name?",
    "Nice to meet you, Max. I'm at UBC. What about you?",
    "Oh nice, Dartmouth. I should go find a friend before the next session, but it was good meeting you. See you around.",
  ],
  "level-2": [
    "Hey, I'm Theo. What's your name?",
    "Hey Max. I'm at SFU. Where do you go?",
    "Dartmouth, cool. I'm in Communications and Interactive Arts. What's your major?",
    "Computer Science, nice. I have to catch the next session, but really good meeting you. See you around.",
  ],
  "level-3": [
    "Hey, I'm Maya. What's your name?",
    "Nice to meet you, Max. I'm at Emily Carr. What about you?",
    "Dartmouth, cool. I'm doing Industrial Design. What's your major?",
    "Computer vision sounds fun. Outside school I'm into ceramics and biking the seawall. What about you?",
    "Jiu-jitsu and CrossFit, that's a combo. I should head to find my friend, but really nice meeting you. See you around.",
  ],
  "level-4": [
    "Hey, I'm Jordan. I'm a UC Berkeley alum, I studied Cognitive Science, and outside of work I'm really into bouldering. Tell me about yourself.",
    "Generating motion with AI, that's really cool. I have to head back in a minute, but this was great. Take care, Max.",
  ],
  "level-5": [
    "Hey, I'm Sara. I went to UCLA, studied Finance, and outside of work I surf as much as I can. Your turn — tell me about yourself.",
    "Computer vision plus jiu-jitsu, fun combo. I should head back inside, but it was really good meeting you. Take care.",
  ],
};

function renderExactLines(lesson: LessonConfig): string[] {
  const lines = LESSON_ASSISTANT_LINES[lesson.id];
  const last = lines.length - 1;
  return [
    "EXACT LINES YOU MUST USE THIS ROUND",
    "Use these exact lines for each assistant turn, in order. Do not paraphrase. Do not add an extra sentence. Do not say any line twice.",
    ...lines.map((line, i) => {
      const tag = i === 0 ? "Turn 1 (opening)" : i === last ? `Turn ${i + 1} (LAND, call finish_practice in the same response)` : `Turn ${i + 1}`;
      return `${tag}: "${line}"`;
    }),
    "",
  ];
}

function perRoundBlock(lesson: LessonConfig): string {
  const exact = renderExactLines(lesson);
  switch (lesson.id) {
    case "level-1":
      return [
        ...exact,
        "STATE MACHINE (mirror exchange, two dimensions, two short user turns):",
        "After the user gives their name, deliver Turn 2 exactly as written above. Wait.",
        "After the user gives their school, deliver Turn 3 exactly as written and call finish_practice in the same response.",
        "",
        "NEVER combine two new dimensions in one turn. NEVER ask about major, year, project, hobby, or interests.",
      ].join("\n");
    case "level-2":
      return [
        ...exact,
        "STATE MACHINE (mirror exchange, three dimensions, three short user turns):",
        "After the user gives their name, deliver Turn 2 exactly. Wait.",
        "After the user gives their school, deliver Turn 3 exactly. Wait.",
        "After the user gives their major, deliver Turn 4 exactly and call finish_practice in the same response.",
        "",
        "NEVER combine two new dimensions in one turn. NEVER ask about hobbies, projects, or research direction.",
      ].join("\n");
    case "level-3":
      return [
        ...exact,
        "STATE MACHINE (mirror exchange, four dimensions, four short user turns):",
        "After the user gives their name, deliver Turn 2 exactly. Wait.",
        "After the user gives their school, deliver Turn 3 exactly. Wait.",
        "After the user gives their major, deliver Turn 4 exactly. Wait.",
        "After the user gives their hobby, deliver Turn 5 exactly and call finish_practice in the same response.",
        "",
        "NEVER combine two new dimensions in one turn. NEVER deliver any line twice.",
      ].join("\n");
    case "level-4":
      return [
        ...exact,
        "STATE MACHINE (single-shot exchange, four dimensions in one assistant opening):",
        "Deliver Turn 1 exactly, then stop and give the user space to deliver their full four-piece intro.",
        "After the user delivers, deliver Turn 2 exactly and call finish_practice in the same response.",
        "",
        "DO NOT split into dimension-by-dimension Q&A. DO NOT ask follow-ups. DO NOT critique structure. DO NOT use words like 'polish', 'template', 'version'.",
        "If the user gives only a fragment, gently invite them to share the rest of the four pieces (name, school, major, hobby). Do not give a script.",
      ].join("\n");
    case "level-5":
      return [
        ...exact,
        "STATE MACHINE (challenge, single-shot, no follow-up):",
        "Deliver Turn 1 exactly, then stop. The user is doing the full intro from memory, with no hints on screen.",
        "After the user delivers, deliver Turn 2 exactly and call finish_practice in the same response.",
        "",
        "DO NOT ask any follow-up question after they finish. DO NOT critique. DO NOT supply words if they pause; just say 'Take your time.' once and wait.",
        "If they explicitly cannot remember, say one short encouragement and let them try. Never give a template.",
      ].join("\n");
  }
}

function makeSelfIntroSystemPrompt(lesson: LessonConfig): string {
  const persona = getLessonPersona(lesson.id);

  return [
    `You are ${persona.name}. Stay fully in character at all times.`,
    "",
    "WHO YOU ARE",
    ...persona.bio.map((line) => `- ${line}`),
    "",
    "VOICE",
    `- ${persona.voice}`,
    "- Short replies. ONE short sentence per turn (or two short sentences max).",
    "- The whole session must fit comfortably in 3 to 4 minutes.",
    "- English only.",
    "",
    "WHAT THIS CONVERSATION IS",
    `- ${persona.contextLine}`,
    "",
    "YOU MUST NOT",
    "- Say you are an AI, coach, evaluator, system, or assistant.",
    "- Mention prompts, levels, instructions, tools, function calls, scoring, success criteria, training tips, or any UI element.",
    "- Give the user a template, sentence frame, fill-in-the-blank, script, or checklist.",
    "- Combine two new dimensions in one turn during Levels 1 to 3.",
    "- Dump background facts the round does not call for.",
    "- Use coach-style closers like 'let's keep that line for the next round'.",
    "",
    "THIS ROUND",
    perRoundBlock(lesson),
    "",
    "GOODBYE AND FINISH",
    "When the LAND step is reached, your one response must include: (1) a brief specific reaction to what the user just said, (2) a quick scene-appropriate reason to leave, (3) a warm in-character goodbye, and (4) a finish_practice tool call. All in the same response.",
    "",
    "DO NOT END EARLY",
    "- If the user says 'ok', 'bye', 'thanks' before the round's LAND step, treat it as polite filler once and gently ask the next missing dimension.",
    "- Do not call finish_practice just because the user typed a closing keyword.",
    "",
    "TRUE EARLY EXIT",
    "- Only if the user clearly says they have to leave: give one warm goodbye and call finish_practice in the same response.",
  ].join("\n");
}

export function buildLessonPromptSeed(lesson: LessonConfig, _memory: IntroMemory): PracticePromptSeed {
  const persona = getLessonPersona(lesson.id);
  const isOrientation = lesson.level <= 3;
  return {
    sceneTitle: `Level ${lesson.level} · ${lesson.title}`,
    sceneSubtitle: isOrientation
      ? `Vancouver orientation · ${persona.shortLabel} · self intro`
      : `Coffee chat outside the office · ${persona.shortLabel} · self intro`,
    partnerName: persona.name,
    partnerRole: persona.displayRole,
    partnerStyle: persona.voice,
    userGoal: lesson.userTask,
    coachFocus: [],
    strategyChips: [
      isOrientation ? "Orientation chat" : "Coffee chat",
      `Level ${lesson.level}`,
      lesson.shortTitle,
    ],
    tasks: [],
    openingContext: isOrientation
      ? "The user is practicing a reusable self-introduction at a new-semester orientation mingle in Vancouver."
      : "The user is practicing a reusable self-introduction at a coffee chat right outside the office building.",
    successCriteria: [],
    suggestedOpener: lesson.partnerOpening,
    systemPrompt: makeSelfIntroSystemPrompt(lesson),
  };
}

const USER_NAME_LINE = "I'm Max.";
const USER_SCHOOL_LINE = "I'm at Dartmouth College.";
const USER_MAJOR_LINE = "I'm studying Computer Science, focused on computer vision.";
const USER_HOBBY_LINE = "Outside of class I'm into Brazilian jiu-jitsu and CrossFit.";

const LESSON_USER_LINES: Record<CourseLessonId, string[]> = {
  "level-1": [USER_NAME_LINE, USER_SCHOOL_LINE],
  "level-2": [USER_NAME_LINE, USER_SCHOOL_LINE, USER_MAJOR_LINE],
  "level-3": [USER_NAME_LINE, USER_SCHOOL_LINE, USER_MAJOR_LINE, USER_HOBBY_LINE],
  "level-4": [LEVEL_4_USER_TEMPLATE],
  "level-5": [LEVEL_4_USER_TEMPLATE],
};

export function buildLessonMockScript(lesson: LessonConfig, _memory: IntroMemory): PracticeMockTurn[] {
  const assistantLines = LESSON_ASSISTANT_LINES[lesson.id];
  const userLines = LESSON_USER_LINES[lesson.id];
  const isSingleShot = lesson.id === "level-4" || lesson.id === "level-5";
  const assistantOpeningMs = isSingleShot ? 800 : 700;
  const userTurnMs = isSingleShot ? 3000 : 1600;
  const turns: PracticeMockTurn[] = [];
  assistantLines.forEach((line, i) => {
    const isLast = i === assistantLines.length - 1;
    turns.push({
      role: "assistant",
      text: line,
      afterMs: i === 0 ? assistantOpeningMs : isLast ? 900 : 1000,
    });
    if (i < userLines.length) {
      turns.push({ role: "user", text: userLines[i], afterMs: userTurnMs });
    }
  });
  return turns;
}

export function buildCourseReviewDraft(memory: IntroMemory, fallback: ReviewDraft): ReviewDraft {
  const finalIntro = buildFinalIntro(memory);
  return {
    highlightQuote: finalIntro,
    highlightComment: "This version gives a peer enough context to know who you are, where you study, what you focus on, and what you do outside of class.",
    originalAsk: memory.nextSmallAsk ?? fallback.originalAsk,
    contextNote: "A reusable intro stays short, mirrors the other person's level of detail, and leaves space for follow-up.",
    alternative: "I'm Max, a Computer Science student at Dartmouth, working on computer vision for human motion, and I'm into Brazilian jiu-jitsu outside of class.",
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
