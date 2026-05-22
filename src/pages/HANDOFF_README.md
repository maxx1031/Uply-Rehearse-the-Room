# Uply Onboarding — Modular Drop-in

Drop this folder anywhere in your `src/` (e.g. `src/uply/`) and import the
screens individually, or use the wrapper `<UplyOnboardingFlow/>` to get
the full ACT I → INTERLUDE → EPILOGUE pipeline.

## Files

```
uply/
├─ styles.css          ← keyframes + font import + color tokens (import once)
├─ UplyUI.tsx          ← shared primitives (buttons, chips, figures, mic, etc.)
├─ ActI.tsx            ← StageScreen, ConversationScreen
├─ Interlude.tsx       ← AnalyzingScreen, ResultScreen, ReflectionScreen
├─ Epilogue.tsx        ← GoalScreen, SloganScreen, HomeScreen
└─ OnboardingFlow.tsx  ← wrapper state machine that chains everything
```

Zero dependencies beyond React. No Tailwind, no framer-motion, no SVG asset files.

## Quick start

```tsx
// src/main.tsx (or wherever your CSS lives)
import "./uply/styles.css";

// In your App, after the CurtainScreen finishes:
import UplyOnboardingFlow from "./uply/OnboardingFlow";

<UplyOnboardingFlow
  user={{ name: registeredName }}
  resolveArchetype={() => computeArchetype(conversationAnswers)}
  onFinish={({ goalId, bucket, archetype }) => {
    api.saveOnboarding({ goalId, bucket, archetype });
    router.push("/home");
  }}
/>
```

## Mounting individual screens

If you want to integrate piece-by-piece (recommended when slotting into
your existing animated wrapper), import the screens directly:

```tsx
import { StageScreen, ConversationScreen } from "./uply/ActI";
import { AnalyzingScreen, ResultScreen, ReflectionScreen } from "./uply/Interlude";
import { GoalScreen, SloganScreen, HomeScreen } from "./uply/Epilogue";
```

Every screen renders inside an `position:absolute; inset:0` container,
so drop them into your existing phone-frame's screen slot.

## Flow & contracts

```
ACT I
─────
StageScreen
  props: { onMicTap: () => void }
  fires: onMicTap          → next screen

ConversationScreen
  props: { onComplete, onSkip: () => void }
  fires: onComplete        → after the user picks the "Can I follow you on
                             LinkedIn?" trigger choice + Maya accepts,
                             then route directly to AnalyzingScreen
         onSkip            → user taps the top-right "End scene ✕" chip

INTERLUDE
─────────
AnalyzingScreen
  props: { onDone: () => void }
  fires: onDone            → auto after ~4.2s (4 staged ticks)

ResultScreen
  props: { archetypeId?: ArchetypeId; onContinue: () => void }
  defaults to "quiet-observer". Edit ARCHETYPES in Interlude.tsx to retune
  copy or add new IDs.

ReflectionScreen
  props: { onContinue: (bucket: "left" | "mid" | "right") => void }
  fires: onContinue        → submits the slider position bucket so you can
                             persist it / branch downstream.

EPILOGUE
────────
GoalScreen
  props: { onPick: (goalId: GoalId) => void }
  fires: onPick            → user's first-lesson selection
                             (one of: "small-talk" | "follow-up" | "ask-help" | "pitch")
                             Edit GOALS in Epilogue.tsx to retune.

SloganScreen
  props: { onDone: () => void }
  fires: onDone            → auto after ~3.6s

HomeScreen
  props: { user?: User; goalId?: GoalId; onRestart?: () => void }
```

## Customizing

- **Archetype taxonomy** — edit `ARCHETYPES` in `Interlude.tsx` and the
  `ArchetypeId` union. Pass your chosen id to `<ResultScreen archetypeId="..."/>`.
- **Goal → lesson mapping** — `GOALS` array in `Epilogue.tsx`. Each entry's
  `scene` string is the eyebrow text shown on the homepage card; map the
  `id` field to your real lesson IDs in `onFinish` / `onPick`.
- **Dialogue beats** — `SCRIPT` array at the top of `ActI.tsx`. Each beat
  has `npc` (Maya's line), an optional `hint` (the stage-whisper), and a
  list of `choices`. Tag one choice with `ending: true` to make it the
  scene-ending trigger; all others use `next: <beatIndex>`.
- **Colors & fonts** — `:root` tokens in `styles.css` (lavender/indigo/cream
  palette + Playfair Display headline + Manrope body). Swap font URLs at the
  top if you self-host.

## Animations

All keyframes are prefixed `uply-*` so they won't collide with yours:
- `uply-fade-up`, `uply-fade` (entry transitions; bound as `.uply-fade-up`
  and `.uply-fade` utility classes)
- `uply-float`, `uply-flicker`, `uply-typing`, `uply-ripple`,
  `uply-glow-pulse`, `uply-spin`, `uply-stamp-in`, `uply-spotlight` (used
  inline on individual elements via the `animation` style)

If your bundler or CSP blocks `@import` of Google Fonts, comment out the
`@import url(...)` line in `styles.css` and load the fonts yourself.

## Notes & known gaps

- **No voice input** — the mic UI is decorative. ConversationScreen is a
  tap-to-pick branching tree, not a speech recognizer. Wire it to your
  actual ASR/STT layer by replacing the `pickChoice` handler.
- **Archetype is not auto-computed** — pass `resolveArchetype` to
  `UplyOnboardingFlow` (or `archetypeId` directly to `ResultScreen`). The
  default is `"quiet-observer"`.
- **Auth screens (register / login / ticket / curtain)** are NOT in this
  bundle — you said you already have those.
