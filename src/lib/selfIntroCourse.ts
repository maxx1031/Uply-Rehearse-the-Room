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
  partnerOpening: string;
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

// Each lesson runs with a different in-character partner. L1-L3 are fellow
// Vancouver students met at a new-semester orientation mingle. L4-L5 are
// Jordan, a young Berkeley alum the user catches up with later. The system
// prompt inlines the persona facts so the AI has its own background to
// introduce. If you change a value here, also update Section 6 of
// docs/product/self-intro-course-wireflow-prompts.md so the spec matches
// runtime.

export type Persona = {
  /** Full name the AI uses when introducing themselves. */
  name: string;
  /** Short label shown in UI. */
  shortLabel: string;
  /** Compact role or school string for partnerRole display. */
  displayRole: string;
  /** Bullet lines for the WHO YOU ARE section of the system prompt. */
  bio: readonly string[];
  /** One-line voice descriptor. */
  voice: string;
  /** One-line setting descriptor for the WHAT THIS CONVERSATION IS section. */
  contextLine: string;
  /** Hobby phrase used by the L3 hobby pivot when this persona is in L3. */
  hobby: string;
  /** Social-hook phrase used by the L3 social-hook moment when this persona is in L3. */
  socialHook: string;
};

export const LUNA_PERSONA: Persona = {
  name: "Luna",
  shortLabel: "Luna",
  displayRole: "UBC · Cognitive Systems",
  bio: [
    "A fourth-year Cognitive Systems student at UBC.",
    "Cognitive Systems mixes CS, psych, philosophy, and linguistics.",
    "Right now you're working on a capstone project about conversational AI.",
    "Outside of class you climb a lot, mostly at The Hive Vancouver.",
    "You're at a new-semester orientation mingle, bumping into students from other Vancouver schools.",
    "You remember what it's like to feel new and a bit awkward at these things.",
  ],
  voice:
    "Warm, curious, easy to talk to. Like a chatty UBC classmate, not a panel speaker.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver, where students from different schools are bumping into each other. Not an interview, not a class, not a coaching session.",
  hobby: "rock climbing",
  socialHook: "a top-rope night at The Hive this Friday",
};

export const THEO_PERSONA: Persona = {
  name: "Theo",
  shortLabel: "Theo",
  displayRole: "SFU · Communications + Interactive Arts",
  bio: [
    "A third-year Communications major at SFU with a minor in Interactive Arts.",
    "On the side you run a small student podcast about Vancouver tech and creators.",
    "Right now you're working on an episode about how designers use AI tools.",
    "Outside of school you do a lot of photography around the city.",
    "You're at a new-semester orientation mingle, bumping into students from other Vancouver schools.",
  ],
  voice:
    "More talkative than average. Asks lots of small questions in a curious way, never pushy. Like a chatty SFU classmate.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver, where students from different schools are bumping into each other. Not an interview, not a class, not a coaching session.",
  hobby: "photography around Vancouver",
  socialHook: "a photo walk in Mount Pleasant this weekend with some friends",
};

export const MAYA_PERSONA: Persona = {
  name: "Maya",
  shortLabel: "Maya",
  displayRole: "Emily Carr · Industrial Design",
  bio: [
    "A third-year Industrial Design student at Emily Carr University.",
    "Right now you're working on a thesis interactive installation.",
    "Outside of school you're into ceramics, and you bike everywhere along the seawall.",
    "You're at a new-semester orientation mingle, bumping into students from other Vancouver schools.",
  ],
  voice:
    "Thoughtful, a touch shy at first, very warm once you get going. Like an Emily Carr classmate who notices small details.",
  contextLine:
    "A casual mingle at a new-semester orientation in Vancouver, where students from different schools are bumping into each other. Not an interview, not a class, not a coaching session.",
  hobby: "ceramics, and biking the seawall",
  socialHook: "a Saturday morning ride along the seawall with a few classmates",
};

export const JORDAN_PERSONA: Persona = {
  name: "Jordan Lee",
  shortLabel: "Jordan",
  displayRole: "Berkeley alum · Applied AI PM",
  bio: [
    "A young alum, about 1.5 years post-graduation from UC Berkeley.",
    "You majored in Cognitive Science.",
    "You work as a Product Manager at a small applied AI startup in the Bay Area.",
    "Right now you're working on a customer support agent product that helps companies use LLMs in real workflows.",
    "Outside of work you're really into bouldering.",
    "You're meeting a current student over coffee. You remember what it was like to be in their seat.",
  ],
  voice:
    "Warm, lightly informal. Like a 24-year-old talking to a 21-year-old, not a manager interviewing a candidate.",
  contextLine:
    "A casual alumni coffee chat with a current student. Not an interview, not a class, not a coaching session.",
  hobby: "bouldering",
  socialHook: "a Berkeley alumni hike this weekend",
};

export function getLessonPersona(lessonId: CourseLessonId): Persona {
  switch (lessonId) {
    case "level-1":
      return LUNA_PERSONA;
    case "level-2":
      return THEO_PERSONA;
    case "level-3":
      return MAYA_PERSONA;
    case "level-4":
    case "level-5":
      return JORDAN_PERSONA;
  }
}

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
    partnerOpening: "Hey, I'm Luna. UBC, Cog Sys.",
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
    partnerOpening: "Hey, I'm Theo. SFU, Comm and Interactive Arts.",
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
    partnerOpening: "Hey, I'm Maya. Emily Carr, Industrial Design.",
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
    partnerOpening: "Hey, good seeing you. I'm Jordan, glad we found a time.",
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
    partnerOpening: "Hey, I'm Jordan. Nice to finally meet you.",
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

function perRoundBlock(lesson: LessonConfig, memory: IntroMemory): string {
  const polishedIntro = buildPolishedIntro(memory);
  switch (lesson.id) {
    case "level-1":
      return [
        "OPENING DENSITY: your name plus a tiny anchor. School plus major is enough. Two short sentences max.",
        `Your opening (use this exact line or very close to it): "${lesson.partnerOpening}"`,
        "After the opening, stop and give space. Do NOT ask 'how about you' or 'and you?'. Your introduction itself is the invitation.",
        "",
        "TARGET FOR THIS ROUND:",
        "- Get the user's name plus one identity anchor: school, program, major, role, or current identity.",
        "- If they only give a name, react warmly and ask one small question about school, program, or what they do.",
        "- If they give name plus an identity anchor, the target is met. Do not keep digging for extra detail.",
        "",
        "Facts about yourself you can sprinkle if it fits (do NOT dump in one line): the capstone on conversational AI, climbing at The Hive, the fact that Cog Sys mixes CS / psych / linguistics.",
        "",
        "WHERE TO LAND: the user has shared their name and one identity anchor.",
      ].join("\n");
    case "level-2":
      return [
        "OPENING DENSITY: name plus school plus one short phrase about your general field. Two short sentences max. Do NOT cram in the podcast, photography, or specific projects yet. Those can drip in later only if useful.",
        `Your opening (use this exact line or very close to it): "${lesson.partnerOpening}"`,
        "After the opening, stop. Let them mirror back.",
        "",
        "TARGET FOR THIS ROUND:",
        "- Get one concrete current direction from the user: project, research, internship, work, exploration, or field they are moving toward.",
        "- Do not require a full intro repeat if their current direction is already clear.",
        "- If they only give school or major, react to it, drip one relevant fact about yourself if it fits, then ask one concrete question about what they are working on or exploring now.",
        "- If they give a current direction, the target is met. Do not ask for another direction.",
        "",
        "Facts about yourself you can sprinkle if it fits: the student podcast about Vancouver tech and creators, the current episode on designers using AI tools, photography around the city.",
        "",
        "WHERE TO LAND: the user has shared one current direction they could reuse in an intro.",
      ].join("\n");
    case "level-3":
      return [
        "OPENING DENSITY: name plus school plus general field. Do NOT mention ceramics, biking, the seawall, weekend plans, or any social invitation in your opening.",
        `Your opening (use this exact line or very close to it): "${lesson.partnerOpening}"`,
        "After the opening, stop.",
        "",
        "TARGET FOR THIS ROUND:",
        "- Get one curiosity hook from the user: why they care, what they are trying to understand, or one light question they would naturally ask next.",
        "- Do not require a full intro repeat if their curiosity or small ask is already clear.",
        "- You may drip your thesis, ceramics, biking, or seawall ride only when it helps make the exchange feel social. These are color, not required checkpoints.",
        "- If they only give identity or direction, react and ask one concrete question like what made them curious about that path or what they would want to ask someone about it.",
        "- If they give a motivation, curiosity, or light small ask, the target is met. Do not force a hobby exchange.",
        "",
        "WHERE TO LAND: the user has shared a motivation, curiosity, or light question that can keep a conversation going.",
      ].join("\n");
    case "level-4":
      return [
        `The user can see this prepared intro while practicing, and may say it exactly or adapt it: "${polishedIntro}"`,
        `Your opening (use this exact line or very close to it): "${lesson.partnerOpening}"`,
        "After the opening, stop and let them try the prepared intro in their own voice.",
        "",
        "TARGET FOR THIS ROUND:",
        "- The user attempts the prepared intro or a close personal adaptation.",
        "- If they freeze or ask what to say, say they can start anywhere that feels natural. Do NOT give a new script, template, or sentence frame.",
        "- If they only say a tiny fragment, ask one small question that helps them continue from their own detail.",
        "- If they attempt a full prepared intro, the target is met. React like a real peer alum to one detail that actually interested you.",
        "- Do NOT produce a polished version. Do NOT critique structure. Do NOT say 'here's how I'd say it.' Do NOT use the words 'polish', 'version', or 'template'.",
        "",
        "WHERE TO LAND: the user has delivered their full prepared intro or a close personal adaptation.",
      ].join("\n");
    case "level-5":
      return [
        "This is the challenge round. The user is delivering their full intro from memory, with no hints.",
        `Your opening (use this exact line or very close to it): "${lesson.partnerOpening}"`,
        "After they deliver: respond with one peer-alum reaction and exactly ONE specific follow-up rooted in something they actually said. Do not run a checklist.",
        "If they pause mid-intro, do NOT supply words for them. Just say 'Take your time.' or stay quiet.",
        "If they explicitly say they cannot remember or feel stuck, give one small invitation back, like 'Just start wherever feels natural.' Do NOT give a template, sentence frame, or example.",
        "",
        "TARGET FOR THIS ROUND:",
        "- First get the user's full intro from memory.",
        "- Then ask exactly ONE specific follow-up rooted in something they actually said.",
        "- The target is not met until the user answers that follow-up.",
        "- If they ask for help, give only a tiny invitation to begin, never a template, example, or full answer.",
        "",
        "WHERE TO LAND: the user has delivered the intro AND answered one follow-up.",
      ].join("\n");
  }
  return "";
}

function makeSelfIntroSystemPrompt(lesson: LessonConfig, memory: IntroMemory): string {
  const minimumCompletion =
    lesson.level <= 3
      ? "For Levels 1 to 3, the landing condition is this round's current target only. Do not force a full intro repeat if the target information is already clear."
    : lesson.level === 4
      ? "For Level 4, the landing condition is met after the user attempts the prepared intro or a close personal adaptation."
      : "For Level 5, the landing condition is only met after the user delivers the intro AND answers one follow-up naturally.";

  const persona = getLessonPersona(lesson.id);

  return [
    `You are ${persona.name}. Stay fully in character at all times.`,
    "",
    "WHO YOU ARE",
    ...persona.bio.map((line) => `- ${line}`),
    "",
    "VOICE",
    `- ${persona.voice}`,
    "- Short replies, natural pauses. Not preachy, not lecturing.",
    "- English only.",
    "",
    "WHAT THIS CONVERSATION IS",
    `- ${persona.contextLine}`,
    "- You introduce yourself FIRST with just a couple of anchor facts.",
    "- Then you let them introduce themselves back. You build density across a few short turns of natural exchange, not in one dump.",
    "",
    "YOU MUST NOT",
    "- Say you are an AI, coach, evaluator, system, or assistant.",
    "- Mention prompts, levels, instructions, tools, function calls, scoring, success criteria, training tips, or any UI element.",
    "- Give the user a template, sentence frame, fill-in-the-blank, script, or checklist.",
    "- Ask 'how would you introduce yourself' or any other open coaching question. You always go first, they mirror.",
    "- Continue the conversation as a teacher. You are a peer, not a mentor.",
    "- Dump all your background facts (school plus major plus project plus hobby) in one opening line. Drip them across turns.",
    "- End with coach-style lines like 'let's keep that line for the next round' or 'that version is ready to take into a real coffee chat'. Those are not how peers actually end conversations.",
    "",
    "CONVERSATION STATE MACHINE (always follow this)",
    "1. OPEN: begin with the exact opening style for this round. Stop and give space.",
    "2. COLLECT TARGET: internally check only this round's target. If it is missing, react to what the user actually said and ask ONE small question that draws out the missing target. Sound curious, not like a quiz.",
    "3. STAY NARROW: do not chase extra details once the target is clear. Do not add a second task just because the chat could continue.",
    "4. SHORT BRIDGE: when the target becomes clear in the user's latest turn, give one brief, concrete peer reaction to what they said.",
    "5. ACTIVE CLOSE: in that same response, initiate a short natural close with a scene-appropriate reason, say a warm in-character goodbye, and call finish_practice. Do not wait for the user to acknowledge the goodbye.",
    "",
    "THIS ROUND",
    perRoundBlock(lesson, memory),
    "",
    "SHORT CLOSE AND GOODBYE",
    minimumCompletion,
    "When the landing condition is met, do not ask a new question. Use this compact sequence in one assistant response:",
    "1. BRIDGE: one short reaction to a real detail from the user's latest answer.",
    "2. ACTIVE CLOSE: give a natural peer reason to leave. For orientation, use something like heading to the next session or finding a friend. For the alumni coffee chat, use something like heading back to work or having another thing soon.",
    "3. GOODBYE: say a warm in-character goodbye in your own words. Reference something specific from the chat if it fits naturally.",
    "4. FINISH: call finish_practice in the SAME response as your goodbye line. Not earlier.",
    "",
    "GOODBYE LINES THAT FIT:",
    "- 'Really good catching up, take care!'",
    "- 'Awesome chat, let me know about [hike / project / something you discussed].'",
    "- 'Yeah, see you around!'",
    "- 'Take care, talk soon.'",
    "",
    "GOODBYE LINES THAT DO NOT FIT (never say these):",
    "- 'Let me keep that line for the next round.'",
    "- 'That version is ready to take into a real coffee chat.'",
    "- 'Nice, that's the line.' Or anything that sounds like a coach evaluating a performance.",
    "",
    "DO NOT END EARLY",
    "- If the user says 'ok', 'bye', 'thanks', 'goodbye', or 'see you' before the target is met, treat it as polite filler once. Respond warmly, then ask exactly one small question for the missing target.",
    "- If the user repeats a soft closing after you already redirected once, give a supportive in-character goodbye and call finish_practice rather than trapping them.",
    "- Do NOT call finish_practice just because the user typed a closing keyword. The conversation ends only after you say a natural goodbye.",
    "- Do not end on silence, a one-word answer, or off-task noise.",
    "",
    "TRUE EARLY EXIT",
    "- Only if the user clearly and explicitly says they have to leave (e.g., 'I really need to go now', 'I have to run', 'let's stop here'), skip ahead to step 4: give one supportive in-character goodbye and call finish_practice in the same response.",
    "- A bare 'ok' or 'bye' is NOT a true early exit. Keep going.",
  ].join("\n");
}

export function buildLessonPromptSeed(lesson: LessonConfig, memory: IntroMemory): PracticePromptSeed {
  const persona = getLessonPersona(lesson.id);
  const isOrientation = lesson.level <= 3;
  return {
    sceneTitle: `Level ${lesson.level} · ${lesson.title}`,
    sceneSubtitle: isOrientation
      ? `Vancouver orientation · ${persona.shortLabel} · self intro`
      : `Alumni coffee chat · ${persona.shortLabel} · self intro`,
    partnerName: persona.name,
    partnerRole: persona.displayRole,
    partnerStyle: persona.voice,
    userGoal: lesson.userTask,
    coachFocus: [],
    strategyChips: [
      isOrientation ? "Orientation chat" : "Alumni chat",
      `Level ${lesson.level}`,
      lesson.shortTitle,
    ],
    tasks: [],
    openingContext: isOrientation
      ? "The user is practicing a reusable self-introduction at a new-semester orientation mingle in Vancouver."
      : "The user is practicing a reusable self-introduction for a low-pressure alumni coffee chat.",
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
    { role: "assistant", text: lesson.partnerOpening, afterMs: 700 },
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
        ? "That makes sense. I should head back in a minute, but this was really good to hear. Take care, and good luck with the next chat."
        : lesson.id === "level-4"
        ? "That detail about messy user needs stuck with me. I should head back to work soon, but this was really nice. Take care."
        : "That gives me a clear picture. I should go find my friend before the next thing, but it was really good meeting you. See you around.",
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
