export type CourseLessonId = "level-1" | "level-2" | "level-3" | "level-4" | "level-5";

export interface LessonPersona {
  name: string;
  shortLabel: string;
  displayRole: string;
  voice: string;
}

export interface LessonConfig {
  id: CourseLessonId;
  level: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  userTask: string;
  supportLabel: string;
  partnerOpening: string;
  persona: LessonPersona;
}

const LUNA_PERSONA: LessonPersona = {
  name: "Luna",
  shortLabel: "Luna",
  displayRole: "UBC · Cognitive Systems",
  voice: "Warm, curious, easy to talk to",
};

const THEO_PERSONA: LessonPersona = {
  name: "Theo",
  shortLabel: "Theo",
  displayRole: "SFU · Communications + Interactive Arts",
  voice: "Chatty and curious, never pushy",
};

const MAYA_PERSONA: LessonPersona = {
  name: "Maya",
  shortLabel: "Maya",
  displayRole: "Emily Carr · Industrial Design",
  voice: "Thoughtful, warm, detail-oriented",
};

const JORDAN_PERSONA: LessonPersona = {
  name: "Jordan Lee",
  shortLabel: "Jordan",
  displayRole: "Berkeley alum · Applied AI PM",
  voice: "Warm, lightly informal, peer-alum style",
};

export const SELF_INTRO_LESSONS: LessonConfig[] = [
  {
    id: "level-1",
    level: 1,
    title: "Equal exchange",
    shortTitle: "Identity",
    subtitle: "Build a short intro with name, school, and major or role.",
    userTask: "Answer with the same level of detail: name plus school.",
    supportLabel: "Tips show what to include, keep it short and natural.",
    partnerOpening: "Hey, I'm Luna. UBC, Cog Sys.",
    persona: LUNA_PERSONA,
  },
  {
    id: "level-2",
    level: 2,
    title: "Professional anchor",
    shortTitle: "Direction",
    subtitle: "Add current project, work, research, or exploration direction.",
    userTask: "Add one more detail about your major or work direction.",
    supportLabel: "One concrete direction is enough.",
    partnerOpening: "Hey, I'm Theo. SFU, Comm and Interactive Arts.",
    persona: THEO_PERSONA,
  },
  {
    id: "level-3",
    level: 3,
    title: "Curiosity hook",
    shortTitle: "Small ask",
    subtitle: "Turn the intro into a 30-second version with motivation and a small ask.",
    userTask: "Add one personal hook and a light reason to keep talking.",
    supportLabel: "End with one light small ask.",
    partnerOpening: "Hey, I'm Maya. Emily Carr, Industrial Design.",
    persona: MAYA_PERSONA,
  },
  {
    id: "level-4",
    level: 4,
    title: "Mirror polish",
    shortTitle: "Polish",
    subtitle: "Use the polished version, then say it in your own voice.",
    userTask: "Try the polished version and make it sound like you.",
    supportLabel: "Use your own rhythm.",
    partnerOpening: "Hey, good seeing you. I'm Jordan, glad we found a time.",
    persona: JORDAN_PERSONA,
  },
  {
    id: "level-5",
    level: 5,
    title: "No-hint challenge",
    shortTitle: "Challenge",
    subtitle: "Repeat your polished coffee-chat intro and answer one follow-up.",
    userTask: "Do the challenge from memory, without hints.",
    supportLabel: "No hints this round, full intro from memory.",
    partnerOpening: "Hey, I'm Jordan. Nice to finally meet you.",
    persona: JORDAN_PERSONA,
  },
];

export function getLessonByCompletedLessons(completedLessons: number): LessonConfig {
  const clamped = Math.max(0, Math.min(4, Math.floor(completedLessons || 0)));
  return SELF_INTRO_LESSONS[clamped];
}
