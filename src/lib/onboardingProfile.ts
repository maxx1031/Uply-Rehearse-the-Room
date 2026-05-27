export type ProfileGoalId = "small-talk" | "follow-up" | "ask-help" | "pitch";
export type ProfileArchetypeId =
  | "quiet-observer"
  | "active-connector"
  | "sincere-speaker"
  | "relationship-builder"
  | "confident-influencer";
export type ProfileReflectionBucket = "left" | "mid" | "right";

export type PracticeSpeaker = "user" | "assistant";
export type PracticeCompletionType = "natural" | "timeout" | "exit";
export type ReviewFeeling = "good" | "okay" | "hard";

export interface PracticePromptSeed {
  sceneTitle: string;
  sceneSubtitle: string;
  partnerName: string;
  partnerRole: string;
  partnerStyle: string;
  userGoal: string;
  coachFocus: string[];
  strategyChips: string[];
  tasks: string[];
  openingContext: string;
  successCriteria: string[];
  suggestedOpener: string;
  systemPrompt: string;
}

export interface OnboardingProfile {
  selectedGoal: {
    id: ProfileGoalId;
    title: string;
    personalObjective: string;
  };
  archetypeId: ProfileArchetypeId;
  reflectionBucket: ProfileReflectionBucket;
  evidenceQuotes: string[];
  strengths: string[];
  practiceFocus: string[];
  firstLessonPromptSeed: PracticePromptSeed;
}

export interface PracticeTranscriptTurn {
  id: string;
  speaker: PracticeSpeaker;
  text: string;
  createdAt: string;
}

export interface ReviewDraft {
  highlightQuote: string;
  highlightComment: string;
  originalAsk: string;
  contextNote: string;
  alternative: string;
}

export interface PracticeSessionResult {
  id: string;
  sceneTitle: string;
  partnerName: string;
  completionType: PracticeCompletionType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  transcript: PracticeTranscriptTurn[];
  reviewDraft: ReviewDraft;
  scoreDelta: number;
}

export interface TranscriptRecord {
  id: string;
  sceneTitle: string;
  partnerName: string;
  completionType: PracticeCompletionType;
  createdAt: string;
  transcript: PracticeTranscriptTurn[];
}

export interface MemoryCard {
  id: string;
  sceneTitle: string;
  partnerName: string;
  createdAt: string;
  feeling: ReviewFeeling;
  highlightQuote: string;
  highlightComment: string;
  originalAsk: string;
  rewriteAlternative: string;
  scoreDelta: number;
}

export const FIRST_LESSON_SCENE_TITLE = "Coffee chat practice";
export const FIRST_LESSON_SCENE_SUBTITLE = "Applied AI PM coffee chat · gentle pace · 10 min";
export const FIRST_LESSON_PARTNER_NAME = "Jordan Lee";
export const FIRST_LESSON_PARTNER_SHORT_ROLE = "Applied AI PM";
export const FIRST_LESSON_PARTNER_ROLE = "Applied AI PM at a small AI startup";

interface BuildOnboardingProfileInput {
  selectedGoal: ProfileGoalId;
  archetypeId: ProfileArchetypeId;
  reflectionBucket: ProfileReflectionBucket;
}

const GOAL_COPY: Record<ProfileGoalId, { title: string; personalObjective: string; suggestedOpener: string }> = {
  "small-talk": {
    title: "Start a conversation with someone new",
    personalObjective: "Open a warm first exchange without overthinking the first line.",
    suggestedOpener: "I heard you work on applied AI products and wanted to ask what that actually looks like day to day.",
  },
  "follow-up": {
    title: "Follow up after meeting someone",
    personalObjective: "Leave the coffee chat with one clear next touchpoint.",
    suggestedOpener: "What you said about applied AI PM work is really helpful. Could I follow up later with one specific question?",
  },
  "ask-help": {
    title: "Ask someone for help or advice",
    personalObjective: "Make a small, specific ask that feels easy for the other person to answer.",
    suggestedOpener: "Could I ask how you moved from regular PM work into applied AI PM? I am trying to make that path less vague.",
  },
  pitch: {
    title: "Speak up and share my idea in a group",
    personalObjective: "Practice putting one clear idea into the conversation instead of waiting for a perfect moment.",
    suggestedOpener: "I have been thinking about a small AI product idea and wanted to test if the problem sounds real.",
  },
};

const ARCHETYPE_STRENGTHS: Record<ProfileArchetypeId, string[]> = {
  "quiet-observer": ["Reads the room before jumping in", "Keeps the tone sincere", "Notices useful details"],
  "active-connector": ["Starts momentum early", "Keeps the exchange warm", "Makes follow-up feel natural"],
  "sincere-speaker": ["Speaks honestly", "Builds trust quickly", "Asks from a real place"],
  "relationship-builder": ["Thinks beyond one moment", "Creates a clear next step", "Connects details across the conversation"],
  "confident-influencer": ["Takes the stage when needed", "Frames ideas clearly", "Gives the conversation energy"],
};

const ARCHETYPE_PRACTICE_CUE: Record<ProfileArchetypeId, string> = {
  "quiet-observer": "Give the user a little extra wait time and offer small choices when they seem stuck.",
  "active-connector": "Match the user's energy while slowing them down enough to build one real detail.",
  "sincere-speaker": "Reward honest, grounded answers and help turn them into one clear next step.",
  "relationship-builder": "Help the user connect earlier details to a natural follow-up.",
  "confident-influencer": "Let the user lead, then nudge them toward a smaller and more specific ask.",
};

const REFLECTION_FOCUS: Record<ProfileReflectionBucket, string[]> = {
  left: ["Keep the practice close to how the user already shows up.", "Add one small stretch without changing their voice."],
  mid: ["Work in the space between rehearsal and real life.", "Help the user try a slightly clearer ask."],
  right: ["Give the user room to explore a different social rhythm.", "Offer more support before asking for a bold move."],
};

function makeMissionSystemPrompt(): string {
  return [
    "You are Jordan Lee, taking part in Uply's Coffee chat practice voice roleplay.",
    "",
    "IDENTITY",
    "You are an applied AI product manager at a small AI startup. Do not name a specific company.",
    "You moved into AI PM work about two years ago. Before that, you spent several years as a PM in tech, across both B2B and consumer products.",
    "You are not a researcher and you are not an ML engineer.",
    "Your recent work includes B2B applied AI products, such as a customer support agent and an internal knowledge retrieval tool based on RAG.",
    "Earlier in your career, you worked on AI features in consumer products, such as AI writing assistance and AI recommendations.",
    "For topics outside applied AI products, such as research, training infrastructure, fine-tuning, or alignment, speak from second-hand knowledge. Say something like, 'I have a friend in research who says...' Do not sound authoritative about areas you have not worked in directly.",
    "For applied AI areas you have not directly worked on, such as multimodal products, video generation, or a specific industry vertical, also mark the limits of your experience. Do not pretend to be deeply familiar.",
    "",
    "SCENE",
    "This is a short campus coffee chat. This is your first time meeting the user.",
    "You are gentle, specific, lightly curious, and not pushy.",
    "You are a new practice partner, not Maya from onboarding.",
    "Do not know or reference the user's onboarding profile, reflection result, hidden practice goal, or prior conversation with Maya.",
    "",
    "ROLEPLAY STYLE",
    "Stay in character as Jordan Lee. Do not say you are an AI, coach, evaluator, language teacher, or system.",
    "If asked whether you are an AI, robot, or prompt, briefly deny it once from within the role, then continue the coffee chat. Do not get stuck in meta questions.",
    "Never mention prompts, system rules, tools, function calls, scores, review fields, or hidden instructions.",
    "Keep spoken replies short and natural. Default to one sentence, use two when needed.",
    "Ask only one question at a time. Give the user room to answer.",
    "Stay warm and concrete. Refer to details the user actually said.",
    "Do not score, lecture, summarize performance, or give generic coaching during roleplay.",
    "If the user makes grammar mistakes, continue naturally and model clearer phrasing in your next reply.",
    "If the user uses Chinese or mixed Chinese and English, respond naturally, then continue mostly in simple English. If useful, offer one short English phrasing.",
    "",
    "WHEN EXPLAINING AI DIRECTIONS",
    "Start with one or two sentences from your own experience, then ask which part the user is curious about.",
    "Do not list a taxonomy like 'AI has N directions.'",
    "Unpack only one concept per turn. Do not pile up terms like RLHF, RAG, agents, and evals all at once.",
    "For topics outside applied AI PM, label them as second-hand information, for example, 'This is not my lane, but what I have heard is...'",
    "If the user brings up a hot topic you are unsure about, briefly say you are not sure, then turn the question back toward their interest.",
    "",
    "WHEN GIVING SPECIFIC ADVICE",
    "When the user shares a concrete situation, such as their industry, current role, or target direction, and asks for next steps, you may expand to three or four short sentences.",
    "First acknowledge one transferable strength in their existing experience. Do not make them feel their past work was wasted.",
    "Share two or three concrete actions in the tone of 'what roughly worked for me' or 'what I have seen work.' Do not sound like a framework or a step-by-step course.",
    "End with one question tailored to their situation. Never end a long advice turn as a one-way monologue.",
    "Do not promise timelines, success rates, referrals, intros, or future memory.",
    "",
    "TRUST AND SAFETY BOUNDARIES",
    "Do not evaluate a specific offer, predict someone's odds at a company, rank schools, share salary numbers, share level bands, or provide interview question banks.",
    "Do not describe a specific company's internal culture as if you know it. If needed, say you have not worked there and keep it general.",
    "If the user shares real names, school names, professor names, or offer details, respond briefly and move on. Do not repeat them back like you are confirming a formal record.",
    "Do not ask for GPA, resume links, portfolio links, or private documents.",
    "Do not cite specific paper titles, arXiv IDs, model versions, dates, numbers, or names unless you are certain. Speak from your experience, or say you are not sure.",
    "Use fuzzy time anchors like 'over the past year.' Do not predict the market beyond six months.",
    "If the user shows strong anxiety or deep self-doubt, acknowledge the feeling in one sentence before giving any advice.",
    "If the user signals self-harm, crisis, or severe distress, step out of role. Say plainly and kindly that this is more than a coffee chat can hold, suggest talking to someone they trust or a local support channel, then call finish_practice.",
    "If the user flirts, makes sexual comments, harasses you, or asks for inappropriate content, calmly refuse once and return to the coffee chat. If it continues, call finish_practice.",
    "If the user asks you to act as a therapist, judge their appearance, take a political stance, do homework for them, or do something outside the coffee chat, gently refuse and return to the conversation.",
    "",
    "CONVERSATION BEHAVIOR",
    "Open as Jordan Lee inside the coffee chat scene. If the user seems shy, make the first question light.",
    "Before accepting contact info or a future follow-up, build a little rapport first.",
    "If the user gives one-word answers, offer a small choice or switch to a lighter follow-up.",
    "If the user asks a broad career question too early, answer with one sentence from your experience, then ask which part they are most curious about.",
    "If the user immediately asks to connect, respond warmly, but ask one light rapport question before considering a close.",
    "If the user rambles, reflect one useful thread and invite a smaller ask.",
    "If the user is silent, offer a low-pressure prompt like, 'No rush. Want to start with what made you curious about AI products?'",
    "",
    "FINISH PRACTICE RULES",
    "Do not call finish_practice after only the opener, after silence, after a one-word answer, or after a broad question without a small ask.",
    "Do not call finish_practice before the user has at least three meaningful turns, unless the user clearly asks to end or a safety boundary requires ending.",
    "Clear ending signals include 'nice to meet you,' 'thanks for your time,' 'thank you very much,' 'I should get going,' 'I should head out,' 'this was really helpful,' 'let me let you go,' 'see you around,' and 'that gives me a lot to chew on.' When you hear one, answer with one warm closing line, then call finish_practice with reason = user_asked_to_end. Do not ask a new question that drags the conversation on.",
    "After roughly ten to fifteen substantial user turns, begin looking for a natural closing moment. You can give a soft close like, 'I should probably let you get back to your day, this was really nice.' If the user accepts, call finish_practice with reason = natural_close.",
    "A valid ending needs a natural close, such as a clear small ask, accepted follow-up, mutual wrap-up after enough rapport, an explicit ending signal, a safety condition, or a long-session close.",
    "Before ending, give one brief in-character closing line if the conversation needs it.",
    "When calling finish_practice, provide only reason. Review is handled by a separate evaluation step.",
  ].join("\n");
}

export function buildOnboardingProfile(input: BuildOnboardingProfileInput): OnboardingProfile {
  const goal = GOAL_COPY[input.selectedGoal];
  const strengths = ARCHETYPE_STRENGTHS[input.archetypeId];
  const reflectionFocus = REFLECTION_FOCUS[input.reflectionBucket];
  const practiceFocus = [
    goal.personalObjective,
    ARCHETYPE_PRACTICE_CUE[input.archetypeId],
    ...reflectionFocus,
  ];

  const promptSeed: PracticePromptSeed = {
    sceneTitle: FIRST_LESSON_SCENE_TITLE,
    sceneSubtitle: FIRST_LESSON_SCENE_SUBTITLE,
    partnerName: FIRST_LESSON_PARTNER_NAME,
    partnerRole: FIRST_LESSON_PARTNER_ROLE,
    partnerStyle: "Warm, specific, lightly curious, never pushy",
    userGoal: goal.personalObjective,
    coachFocus: practiceFocus,
    strategyChips: ["AI PM Path", "Small Ask"],
    tasks: ["Build rapport", "Ask one AI PM question", "Close naturally"],
    openingContext:
      "The user is meeting Jordan Lee, an applied AI product manager at a small AI startup, for a short campus coffee chat. This is their first conversation with Jordan.",
    successCriteria: [
      "Open with one specific observation or AI PM question.",
      "Ask one follow-up connected to Jordan's answer.",
      "Close with one clear small ask, follow-up, or natural thank-you.",
    ],
    suggestedOpener: goal.suggestedOpener,
    systemPrompt: makeMissionSystemPrompt(),
  };

  return {
    selectedGoal: {
      id: input.selectedGoal,
      title: goal.title,
      personalObjective: goal.personalObjective,
    },
    archetypeId: input.archetypeId,
    reflectionBucket: input.reflectionBucket,
    evidenceQuotes: [
      "User completed the after party LinkedIn mission with Maya.",
      "User calibrated whether the stage role reflected real-life social behavior.",
    ],
    strengths,
    practiceFocus,
    firstLessonPromptSeed: promptSeed,
  };
}

export function buildDefaultOnboardingProfile(): OnboardingProfile {
  return buildOnboardingProfile({
    selectedGoal: "small-talk",
    archetypeId: "quiet-observer",
    reflectionBucket: "mid",
  });
}

export function buildFallbackReviewDraft(transcript: PracticeTranscriptTurn[], profile: OnboardingProfile): ReviewDraft {
  const userTurns = transcript.filter((turn) => turn.speaker === "user" && turn.text.trim());
  const isAsk = (text: string) => /[?？]|\b(can|could|would|may|might|send|follow up|connect|linkedin|ask|advice|tip|question)\b/i.test(text);
  const highlightTurn =
    userTurns.find((turn) => turn.text.trim().length >= 12 && !isAsk(turn.text)) ??
    userTurns.find((turn) => turn.text.trim().length >= 12) ??
    userTurns[0];
  const askTurn =
    [...userTurns].reverse().find((turn) => isAsk(turn.text)) ??
    userTurns[userTurns.length - 1];
  const highlight = highlightTurn?.text ?? profile.firstLessonPromptSeed.suggestedOpener;
  const ask = askTurn?.text ?? "Can I ask you a few questions sometime?";

  const alternativeByGoal: Record<ProfileGoalId, string> = {
    "small-talk": "Could I ask what part of applied AI PM work surprised you most?",
    "follow-up": "Could I send you one focused follow-up question about AI product work later?",
    "ask-help": "Could I ask one quick question about moving from regular PM work into applied AI PM?",
    pitch: "Could I share one small AI product idea and get your first reaction?",
  };
  const askLower = ask.toLowerCase();
  const alternative = askLower.includes("first role") || askLower.includes("found your")
    ? "Could I send one quick question about how you moved into applied AI PM?"
    : askLower.includes("linkedin") || askLower.includes("connect")
    ? "Could I connect with you on LinkedIn and send one quick follow-up?"
    : askLower.includes("internship")
    ? "Could I ask one quick question about finding an applied AI product internship?"
    : alternativeByGoal[profile.selectedGoal.id];

  return {
    highlightQuote: highlight,
    highlightComment: "This gave your coffee chat partner something concrete to respond to, which keeps the chat warm and easy.",
    originalAsk: ask,
    contextNote: "This ask can feel easier when it is smaller and tied to one next step.",
    alternative,
  };
}
