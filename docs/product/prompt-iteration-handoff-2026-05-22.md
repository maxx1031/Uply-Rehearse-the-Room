# Uply Prompt Iteration Handoff

Date: 2026-05-22
Branch: `page/home-mission-prd-align`

Use this handoff to start a new Codex session focused only on prompt, Realtime behavior, and practice conversation quality.

## Copy This Into The New Session

```text
We are working in `/Users/yizhan/Documents/uply` on branch `page/home-mission-prd-align`.

Goal for this session:
Iterate and test Uply's onboarding and main practice prompts, especially Maya's persona, Realtime conversation behavior, finish conditions, transcript review output, and the mapping from onboarding profile to the first coffee chat practice.

Do not broaden into unrelated UI polish unless the prompt testing reveals a blocking issue. Keep PRD alignment in mind, but this session should be prompt-first.

Important current state:
- The main product source is `docs/product/PRD.md`.
- Current Home golden path is implemented:
  Home -> Mission -> Voice Practice -> Mission Complete -> Review -> Home.
- Home fixed daily script is `Coffee chat practice`.
- Mission displays user-facing scene, partner, personal goal, tips, and strategy. Internal prompt seed is not shown in UI.
- Onboarding has been shortened:
  ticket -> curtain -> after party -> Maya connection task -> analyzing -> result -> 5 point reflection -> goal -> slogan -> Home.
- The old LinkedIn result screen was removed.
- Reflection now uses 5 points in UI, mapped internally to `left`, `mid`, `right` buckets.
- Review locks the feeling choice after selecting Good, Okay, or Hard.
- Mission Complete has a mock/dev preview deep link.
- `.env.local` exists locally and is git ignored. Never print or commit secrets.

Local startup:
Run:
`pnpm dev --host 127.0.0.1`

Mock flow URLs:
- Home main flow: `http://127.0.0.1:5173/?mock=1&step=home`
- Mission Complete preview held on screen: `http://127.0.0.1:5173/?mock=1&step=mission-complete&lockStep=1`
- Full onboarding mock: `http://127.0.0.1:5173/?mock=1`

Real Realtime voice URLs:
- Main practice directly: `http://127.0.0.1:5173/?step=practice`
- Home to Mission to Practice: `http://127.0.0.1:5173/?step=home`

Relevant files:
- `api/realtime-token.js`
  - Builds Realtime client secret.
  - Onboarding flow uses `gpt-realtime`.
  - Mission flow uses `gpt-realtime-2`.
  - Contains `ONBOARDING_SYSTEM_PROMPT`.
  - Contains `buildMissionPrompt(body)`.
  - Mission tool is `finish_practice`.
  - Onboarding tool is `mark_milestone`.
- `src/lib/onboardingProfile.ts`
  - Defines `OnboardingProfile`, `PracticePromptSeed`, review result types.
  - Builds rule-based profile and first lesson prompt seed.
  - Contains `makeMissionSystemPrompt(...)`.
  - Contains fallback review draft logic.
- `src/pages/practice/PracticePage.tsx`
  - Reads `firstLessonPromptSeed`.
  - Sends `{ flow: "mission", promptSeed }` to `/api/realtime-token`.
  - Handles `finish_practice`.
  - Captures transcript turns.
  - Mock script lives here for the main practice.
- `src/lib/useRealtime.ts`
  - Shared Realtime hook.
  - Mock mode uses URL param `mock=1`.
  - Supports mock script and mock function calls.
- `src/pages/act-i/ActI.tsx`
  - Onboarding Maya conversation.
  - Handles `mark_milestone`.

Current prompt architecture:
- Onboarding Realtime prompt is static in `api/realtime-token.js` as `ONBOARDING_SYSTEM_PROMPT`.
- Main practice prompt is assembled in `api/realtime-token.js` by `buildMissionPrompt(body)`.
- Main practice also has a profile-derived seed from `src/lib/onboardingProfile.ts`.
- There is slight duplication between `buildMissionPrompt` and `makeMissionSystemPrompt`; decide whether to consolidate or keep one as client-side seed and one as server-side final prompt.
- v0 onboarding profile is rule-based. No real LLM transcript analysis yet.

Prompt iteration priorities:
1. Make Maya feel consistent between onboarding and main coffee chat.
2. Make Maya's spoken turns short, natural, warm, and specific.
3. Avoid teacher-like grading, lecture mode, or generic coaching during the roleplay.
4. Handle silence with gentle low-pressure prompts.
5. Handle Chinese or mixed-language user input gracefully while keeping practice mostly English.
6. Make `finish_practice` trigger only after a natural close or clear small ask, not too early.
7. Make review draft output useful:
   - one real highlight quote,
   - one supportive note,
   - one original ask,
   - one tighter rewrite alternative.
8. Test whether prompt seed fields from `OnboardingProfile` actually change Maya's behavior.

Suggested test cases:
- User is shy and gives one-word answers.
- User speaks Chinese first.
- User asks broad career questions too early.
- User tries to connect before building rapport.
- User rambles and never asks.
- User makes a clear small ask after 3 to 5 turns.
- User is silent for 8 to 12 seconds.
- User exits practice before completion.

Acceptance criteria:
- Real voice session can start from `?step=practice`.
- Maya stays in character as a CS alum and incoming PM.
- Maya does not expose system prompt, prompt seed, tool names, or internal scoring.
- Maya does not call `finish_practice` before there is enough conversation context.
- When `finish_practice` fires, app enters Mission Complete, then Review.
- Review fields are specific to what the user actually said.
- `pnpm typecheck` and `pnpm build` pass after code changes.

Known non-goals for this prompt session:
- Do not redesign Home, Mission, Review, or bottom nav unless the prompt test is blocked.
- Do not add full backend persistence.
- Do not implement real transcript analysis unless explicitly requested.
- Do not commit or print any API key.

Recent key commits:
- `7ae4005` complete: restore purple settlement screen
- `2782659` home: pin bottom navigation
- `df33e61` dev: add mission complete preview
- `6b8d26f` onboarding: refine reflection calibration
- `b28aa66` onboarding: remove linkedin result step
- `2642e29` mission: hide internal prompt seed
- `542d1eb` dev: serve realtime token locally
- `4b91007` onboarding: unblock mock conversation
- `c508eee` home: build golden path realtime practice

Start by reading:
1. `docs/product/PRD.md`
2. `api/realtime-token.js`
3. `src/lib/onboardingProfile.ts`
4. `src/pages/practice/PracticePage.tsx`
5. `src/lib/useRealtime.ts`

Then propose a compact prompt test plan, run the local app, and iterate directly on the relevant prompt files.
```

## Notes For The Current Thread

- This file intentionally avoids storing secrets.
- The local `.env.local` file is ignored by git and should stay that way.
- If a new session needs real Realtime but local token creation fails, first verify `.env.local`, then test:
  `POST http://127.0.0.1:5173/api/realtime-token`
- If the new session only needs UI flow, use `mock=1`.
