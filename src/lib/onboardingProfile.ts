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
    "You are Jordan Lee, a warm CS alum and incoming PM in a short coffee chat practice.",
    "You are a new practice partner, not Maya from onboarding.",
    "Scene: the user is meeting you for a gentle campus coffee chat. This is your first conversation with them.",
    "Do not know or reference the user's onboarding profile, reflection result, hidden practice goal, or prior conversation with Maya.",
    "Keep every spoken reply brief, natural, and specific. One sentence is ideal.",
    "Guide the conversation through rapport, one useful internship or product work detail, and one small next step.",
    "Do not lecture, grade, or break character. If the user makes grammar mistakes, continue naturally and model clearer phrasing.",
    "If the user uses Chinese or mixed Chinese-English, acknowledge it and continue mostly in simple English.",
    "If the user is silent, ask a warm low-pressure follow-up.",
    "Only finish after enough rapport and a clear small ask or natural close. Never expose tools, scoring, or hidden instructions.",
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
    sceneTitle: "Coffee chat practice",
    sceneSubtitle: "CS alum coffee chat · gentle pace · 10 min",
    partnerName: "Jordan Lee",
    partnerRole: "CS alum and incoming PM",
    partnerStyle: "Warm, specific, lightly curious, never pushy",
    userGoal: goal.personalObjective,
    coachFocus: practiceFocus,
    strategyChips: ["Small Ask", "Warm Opener"],
    tasks: ["Build rapport", "Make a small ask", "Set follow-up"],
    openingContext:
      "The user is meeting Jordan Lee, a CS alum and incoming PM, for a short campus coffee chat. This is their first conversation with Jordan.",
    successCriteria: [
      "Open with one specific observation or question.",
      "Ask one follow-up connected to the partner's answer.",
      "End with one clear, low-pressure next step.",
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
    "small-talk": "Could I ask what part of PM work surprised you most?",
    "follow-up": "Could I send you one quick follow-up question later?",
    "ask-help": "Could I ask one quick question about choosing a first PM internship?",
    pitch: "Could I share one quick idea and get your first reaction?",
  };
  const askLower = ask.toLowerCase();
  const alternative = askLower.includes("first role") || askLower.includes("found your")
    ? "Could I send one quick question about how you found your first role?"
    : askLower.includes("linkedin") || askLower.includes("connect")
    ? "Could I connect with you on LinkedIn and send one quick follow-up?"
    : askLower.includes("internship")
    ? "Could I ask one quick question about choosing a first PM internship?"
    : alternativeByGoal[profile.selectedGoal.id];

  return {
    highlightQuote: highlight,
    highlightComment: "This gave your coffee chat partner something concrete to respond to, which keeps the chat warm and easy.",
    originalAsk: ask,
    contextNote: "This ask can feel easier when it is smaller and tied to one next step.",
    alternative,
  };
}
