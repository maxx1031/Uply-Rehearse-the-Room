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

interface BuildOnboardingProfileInput {
  selectedGoal: ProfileGoalId;
  archetypeId: ProfileArchetypeId;
  reflectionBucket: ProfileReflectionBucket;
}

const GOAL_COPY: Record<ProfileGoalId, { title: string; personalObjective: string; suggestedOpener: string }> = {
  "small-talk": {
    title: "Start a conversation with someone new",
    personalObjective: "Open a warm first exchange without overthinking the first line.",
    suggestedOpener: "I saw your CS alumni badge and wanted to ask what kind of work you are doing now.",
  },
  "follow-up": {
    title: "Follow up after meeting someone",
    personalObjective: "Leave the coffee chat with one clear next touchpoint.",
    suggestedOpener: "I liked what you said about product work. Could I follow up with one quick question later?",
  },
  "ask-help": {
    title: "Ask someone for help or advice",
    personalObjective: "Make a small, specific ask that feels easy for the other person to answer.",
    suggestedOpener: "Could I ask how you chose your first PM internship? I am trying to make that path feel less vague.",
  },
  pitch: {
    title: "Speak up and share my idea in a group",
    personalObjective: "Practice putting one clear idea into the conversation instead of waiting for a perfect moment.",
    suggestedOpener: "I have been thinking about one way students could make coffee chats less awkward.",
  },
};

const ARCHETYPE_STRENGTHS: Record<ProfileArchetypeId, string[]> = {
  "quiet-observer": ["Reads the room before jumping in", "Keeps the tone sincere", "Notices useful details"],
  "active-connector": ["Starts momentum early", "Keeps the exchange warm", "Makes follow-up feel natural"],
  "sincere-speaker": ["Speaks honestly", "Builds trust quickly", "Asks from a real place"],
  "relationship-builder": ["Thinks beyond one moment", "Creates a clear next step", "Connects details across the conversation"],
  "confident-influencer": ["Takes the stage when needed", "Frames ideas clearly", "Gives the conversation energy"],
};

const REFLECTION_FOCUS: Record<ProfileReflectionBucket, string[]> = {
  left: ["Keep the practice close to how the user already shows up", "Add one small stretch without changing their voice"],
  mid: ["Work in the space between rehearsal and real life", "Help the user try a slightly clearer ask"],
  right: ["Give the user room to explore a different social rhythm", "Offer more support before asking for a bold move"],
};

function makeMissionSystemPrompt(goal: string, archetypeId: ProfileArchetypeId, bucket: ProfileReflectionBucket): string {
  return [
    "You are Maya Chen, a warm CS alum and incoming PM in a short coffee chat practice.",
    "Scene: the user is meeting you for a gentle campus coffee chat after connecting during onboarding.",
    `The user's personal objective is: ${goal}`,
    `Their onboarding role is ${archetypeId}, and their self-reflection bucket is ${bucket}.`,
    "Keep every spoken reply brief, natural, and specific. One or two sentences is ideal.",
    "Guide the conversation through rapport, one useful internship or product work detail, and one small next step.",
    "Do not lecture, grade, or break character. If the user makes grammar mistakes, continue naturally and model clearer phrasing.",
    "If the user is silent, ask a warm low-pressure follow-up.",
    "When the user has built rapport and made or accepted a small next step, call finish_practice with one highlight and one rewrite.",
  ].join("\n");
}

export function buildOnboardingProfile(input: BuildOnboardingProfileInput): OnboardingProfile {
  const goal = GOAL_COPY[input.selectedGoal];
  const strengths = ARCHETYPE_STRENGTHS[input.archetypeId];
  const reflectionFocus = REFLECTION_FOCUS[input.reflectionBucket];
  const practiceFocus = [
    goal.personalObjective,
    ...reflectionFocus,
  ];

  const promptSeed: PracticePromptSeed = {
    sceneTitle: "Coffee chat practice",
    sceneSubtitle: "CS alum coffee chat · gentle pace · 10 min",
    partnerName: "Maya Chen",
    partnerRole: "CS alum and incoming PM",
    partnerStyle: "Warm, specific, lightly curious, never pushy",
    userGoal: goal.personalObjective,
    coachFocus: practiceFocus,
    strategyChips: ["Small Ask", "Warm Opener"],
    tasks: ["Build rapport", "Make a small ask", "Set follow-up"],
    openingContext:
      "The user is meeting Maya Chen, a CS alum and incoming PM, for a short coffee chat after connecting during onboarding.",
    successCriteria: [
      "Open with one specific observation or question.",
      "Ask one follow-up connected to Maya's answer.",
      "End with one clear, low-pressure next step.",
    ],
    suggestedOpener: goal.suggestedOpener,
    systemPrompt: makeMissionSystemPrompt(goal.personalObjective, input.archetypeId, input.reflectionBucket),
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

export function normalizeReviewDraft(value: unknown, fallback: ReviewDraft): ReviewDraft {
  if (!value || typeof value !== "object") return fallback;
  const input = value as Partial<Record<keyof ReviewDraft, unknown>>;
  return {
    highlightQuote: typeof input.highlightQuote === "string" && input.highlightQuote.trim() ? input.highlightQuote.trim() : fallback.highlightQuote,
    highlightComment: typeof input.highlightComment === "string" && input.highlightComment.trim() ? input.highlightComment.trim() : fallback.highlightComment,
    originalAsk: typeof input.originalAsk === "string" && input.originalAsk.trim() ? input.originalAsk.trim() : fallback.originalAsk,
    contextNote: typeof input.contextNote === "string" && input.contextNote.trim() ? input.contextNote.trim() : fallback.contextNote,
    alternative: typeof input.alternative === "string" && input.alternative.trim() ? input.alternative.trim() : fallback.alternative,
  };
}

export function buildFallbackReviewDraft(transcript: PracticeTranscriptTurn[], profile: OnboardingProfile): ReviewDraft {
  const userTurns = transcript.filter((turn) => turn.speaker === "user" && turn.text.trim());
  const highlight = userTurns[0]?.text ?? profile.firstLessonPromptSeed.suggestedOpener;
  const ask = userTurns[userTurns.length - 1]?.text ?? "Can I ask you a few questions sometime?";

  return {
    highlightQuote: highlight,
    highlightComment: "Warm and specific enough to help the other person respond naturally.",
    originalAsk: ask,
    contextNote: "This ask can feel easier when it is smaller and tied to one next step.",
    alternative: "Could I send you one quick question about internships later?",
  };
}
