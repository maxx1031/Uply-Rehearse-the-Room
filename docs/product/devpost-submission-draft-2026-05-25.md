# Uply Devpost Submission Draft

Date: 2026-05-25
Event: DevNetwork AI/ML Hackathon 2026

## Reference Projects, Story Patterns

Sources:

- https://devpost.com/software/llm-pro-max
- https://devpost.com/software/fashion-mxr7e3
- https://devpost.com/software/foggy
- https://devpost.com/software/cameron-9biv60
- https://devpost.com/software/leetboard

### What strong Devpost stories do

1. Start with a crisp pain, not the technology.
   - LLM Pro Max begins with context-window pain.
   - Mirr.AI begins with return costs and the inability to try clothing online.
   - pFOG begins with a personal Parkinson's story and a specific physical symptom.

2. Make the demo moment concrete.
   - Mirr.AI explains one-photo upload, try-on-any-site, seven angles, outfit recommendations.
   - Cameron explains a camera that observes, reasons, and acts.
   - LeetBoard explains a 3D interview environment with drag-and-drop problems.

3. Use technical depth as proof, not as the opening.
   - The better pages first make the reader care, then use architecture details to prove the project is real.

4. Quantify impact where possible.
   - Mirr.AI uses return-rate, cost, emissions, and market-size numbers.
   - pFOG uses real-time response and accuracy as credibility.

5. Keep accomplishments concrete.
   - "Fully functional product", "works on any site", "real-time detection-to-action loop", "MVP with all features operational" are more persuasive than generic pride.

### What Uply should borrow

- From Mirr.AI: problem framing with a real market and behavioral pain, then a clear product walkthrough.
- From pFOG: human stakes and one specific moment that inspired the build.
- From Cameron: a strong "old passive thing becomes active agent" transformation. For Uply: passive advice becomes live rehearsal.
- From LLM Pro Max: explain the technical trick simply, Uply converts onboarding signals into a personalized practice prompt and review loop.
- From LeetBoard: emphasize a complete MVP built under time pressure, with a focused interactive training experience.

## Devpost Field Drafts

### Project name

Uply

### Elevator pitch

Uply turns awkward social moments into low-pressure AI voice rehearsals, helping students practice coffee chats, small asks, and follow-ups before real life.

Alternative, shorter:

AI voice rehearsal for the social moments students overthink.

### Thumbnail concept

A phone mockup showing a soft theater stage, a glowing silhouette conversation partner, and the words "Coffee chat practice" plus "Curtain up".

Use a 3:2 image. Recommended gallery screenshots:

1. Onboarding theater scene with Maya.
2. Home screen with Coffee chat practice.
3. Mission briefing with Jordan Lee.
4. Voice Practice screen with dialogue bubble.
5. Review screen with highlight and rewrite.

## Project Story

### Inspiration

Uply started with a very specific moment at a networking event.

One of us was standing in the corner of a campus mixer, holding a cold drink, watching small clusters of people laugh and exchange contacts. There was a person across the room who would have been the perfect introduction. We had the line ready in our head. We stood there for almost twenty minutes and never walked over. By the time we worked up the nerve, they had already left.

That moment is not unique. For students and early-career people, especially international students, the hard part of networking is not knowing that you should reach out. It is the moment right before you speak: how to start, how much context to give, how to ask without sounding too vague or too intense, and how to recover if the conversation feels awkward.

Templates and LinkedIn advice posts help with wording, but they do not build social confidence. Real conversations are live, emotional, and full of tiny timing decisions you cannot get from reading. The only thing that actually works is repetition, and most people do not get to rehearse before the room that matters.

We built Uply so that the rehearsal can happen first. The product treats social practice like theater rehearsal. You get a scene, a partner, a small objective, and a chance to try again without judgment, before the real conversation walks out the door.

### What it does

Uply is an AI-powered social rehearsal app for students and early-career professionals.

The current demo focuses on one complete loop: preparing for a low-pressure coffee chat with a CS alum.

The user starts with a short theatrical onboarding flow. They meet Maya at a post-presentation after party, complete a small social task, and receive a lightweight "stage role" that reflects how they tend to show up in social situations. Then they choose a small social goal, such as starting a conversation, following up, asking for help, or speaking up with an idea.

From there, Uply turns that profile into a daily practice mission. In the demo, the user enters "Coffee chat practice" with Jordan Lee, an Applied AI PM at a small AI startup. They see a mission briefing, a personal goal mapped from their onboarding choice, and a few strategy hints, then start a real-time voice rehearsal.

During practice, the user talks to Jordan through an OpenAI Realtime-powered voice experience. The conversation is intentionally short, gentle, and specific. The goal is not to become charismatic overnight. The goal is to practice one small ask, one opener, or one follow-up that can be used in real life.

After the session, Uply gives a lightweight review: how it felt, one highlight from what the user said, and one smaller rewrite they can try next time. The product closes the loop with a memory-card-style state so progress can accumulate over time.

### How we built it

We built Uply as a mobile-first React web app with a theater-inspired design system.

The frontend uses React 18, Vite 6, TypeScript, Tailwind 4, motion/react, lucide-react, and React Router 7. The visual direction uses a soft blue-purple and warm yellow palette, translucent layered cards, stage metaphors, and blurred glowing silhouettes instead of realistic faces, so the experience reads as warm rehearsal rather than test interface.

The voice practice flow uses OpenAI Realtime through WebRTC, specifically the `gpt-realtime-2` model for the mission session. The browser never receives the main API key. Instead, a serverless `/api/realtime-token` endpoint on Vercel mints a short-lived client secret for each Realtime session. The mission flow sends a profile-derived prompt seed to the token endpoint, so Jordan can stay in character and guide the user through a focused coffee chat instead of slipping into generic chatbot mode.

To make the AI partner end the rehearsal naturally rather than at an arbitrary timeout, we exposed a `finish_practice` function call to the model. Jordan can decide, in character, that this conversation has hit a satisfying close, and the client uses that tool call to transition into Mission Complete.

We designed a small product contract called `OnboardingProfile`. It converts onboarding choices into:

- the user's selected social goal
- a stage role
- strengths and practice focus
- a first lesson prompt seed for the Realtime system prompt
- success criteria the review evaluator uses later

Review is intentionally not powered by another LLM round trip in the v0. After practice ends, a small front-end rule evaluator (`buildFallbackReviewDraft`) reads the transcript, picks one real user line for the highlight, and generates one smaller alternative for the rewrite. This keeps the loop fast and prevents an LLM hiccup from blocking the most emotionally important screen.

The main product path is:

1. onboarding theater scene
2. stage role and self-calibration
3. goal selection
4. Home screen with Coffee chat practice
5. Mission briefing
6. Realtime voice practice
7. Mission Complete
8. Review with highlight and rewrite

For demo reliability we also built a `?mock=1` mode that replays a scripted Jordan conversation in the browser. The same UI, the same transitions, and the same review evaluator run end to end without a network call to the Realtime API. That mock path is what we record the demo video against, so a flaky Wi-Fi or a token hiccup cannot break the story.

### Challenges we ran into

The biggest challenge was making AI practice feel like a real social rehearsal instead of a generic chatbot.

We had to keep the AI partner in character, make each turn short and natural, avoid lecture-style coaching during the roleplay, and decide when the conversation should end naturally. We also needed the app to protect the user's sense of safety. Social practice can feel vulnerable, so the UI could not feel like a test or a performance score.

Another challenge was connecting onboarding to practice without exposing internal prompt logic. The user should see a simple personal goal, not a prompt seed. Under the hood, however, that goal needs to shape the mission, the Realtime instructions, and the later review.

On the technical side, we had to coordinate WebRTC lifecycle, token generation, transcript capture, pause/resume behavior, exit handling, and a fallback mock path inside a tight hackathon build.

### Accomplishments that we're proud of

We are proud that Uply is not just a static concept. It has a complete end-to-end practice loop, built and shipped during the hackathon window.

In one flow, a user can enter a theatrical onboarding scene, choose a social goal, start a coffee chat mission, practice by voice with an AI partner, complete the mission, and receive a focused review. The whole loop is under ten minutes.

We are especially proud of four things:

- Turning social practice into a low-pressure theater metaphor (curtain up, stage role, mission, review) that feels warmer than a productivity tool or a test.
- Building a real profile-to-practice pipeline where the user's onboarding goal flows into the Realtime system prompt for Jordan, so the very first rehearsal is already personalized.
- Using a `finish_practice` tool call so the AI can end the conversation naturally, in character, instead of cutting on a timer.
- Creating a restrained review that gives the user one specific highlight quote and one smaller rewrite to try, instead of a feedback wall that would make a nervous user feel worse.

### What we learned

We learned that the most important part of an AI coach is restraint.

For social skills, more feedback is not always better. A nervous user does not need a report card. They need one safe repetition, one specific line they said well, and one smaller way to say the next thing.

We also learned that voice AI needs product design around it. Realtime voice is powerful, but the experience only works when the scene, task, partner persona, exit rules, pause rules, and review loop all support the same emotional promise.

Finally, we learned that personalization does not have to start with a huge memory system. Even a small onboarding profile can make a first practice session feel more relevant when it is translated carefully into the mission and prompt design.

### What's next for Uply

Next, we want to make Uply more personal, persistent, and useful across real social situations.

Short term, we want to improve transcript analysis so the review can pull sharper highlights and rewrite suggestions from the user's actual words. We also want to add more practice scenes, including asking for help, following up after a first meeting, speaking up in a group, and sending a LinkedIn opener.

Medium term, we want to build Records and Coach tabs where users can revisit memory cards, track patterns, and prepare for upcoming real-world conversations.

Long term, Uply can become a social confidence training layer for students and early-career professionals. Instead of giving generic advice, it can help people rehearse the exact moment they are about to face, then turn each practice into a small, compounding improvement.

## Team

To fill before submission. For each member: name, school or role, what they built.

- Member 1:
- Member 2:
- Member 3:

## Built With

Suggested Devpost tags:

- react
- vite
- typescript
- tailwind-css
- openai
- openai-realtime-api
- gpt-realtime
- webrtc
- vercel
- vercel-serverless-functions
- motion
- lucide
- react-router
- nodejs

## Try It Out Links

To fill before submission (none ready yet as of 2026-05-26):

- Live demo (Vercel):
- Live demo (mock mode for offline review): `<live-demo>/?mock=1`
- GitHub repo:
- Demo video (YouTube unlisted recommended, 90 to 120 seconds):

Suggested screenshot capture list (`docs/iterations/`):

1. `home-v1-2026-05-XX.png` Home with Today's Script and Coffee chat practice card.
2. `mission-v1-2026-05-XX.png` Mission briefing with Jordan, personal goal, strategy.
3. `practice-v1-2026-05-XX.png` Voice Practice with Tasks panel and dialogue bubble.
4. `review-v1-2026-05-XX.png` Review with highlight and rewrite.
5. `onboarding-v1-2026-05-XX.png` After-party scene with Maya for context.

## Sponsor Prize Recommendation

Submission deadline is 2026-05-28 at 10:00 AM PDT. With two days left, the realistic submission target is the Overall track. Sponsor tracks each require integrating a specific vendor stack we have not built against, so chasing them now would risk the demo.

Overall track fit (recommended primary submission):

- Prize: Amazon Echos and DevNetwork Premium All-Access Passes.
- Judging: progress made, solves a real problem, feasibility as a business. Uply is strong on all three: full end-to-end loop, a concrete user pain (the moment before speaking), and a clear path from coffee chat rehearsal to a broader social confidence product.

Sponsor track gap analysis (not recommended for this submission):

- TrueFoundry Resilient Agents: would need a TrueFoundry AI Gateway integration plus explicit failure scenarios (LLM outage, MCP error). Realtime voice has natural failure modes we could showcase, but the gateway work alone is more than two days.
- Lark CLI or MCP: would need a Lark CLI integration or a Lark MCP server in the workflow. No natural overlap with the rehearsal product.
- Perfect Corp consumer AR: would require integrating a Perfect Corp API such as virtual try-on or AI skin analysis. Off-theme for a voice rehearsal product.
- Crusoe Nemotron Agent: would require routing inference through Crusoe Cloud Managed Inference on Nemotron-3-Nano. Our entire roleplay system prompt is designed for `gpt-realtime-2`; reproducing the same voice rehearsal quality on a different model in 48 hours is risky.

If we ever revisit, TrueFoundry is the cheapest pivot because the gateway can sit in front of OpenAI Realtime without replacing it.

## Demo Video Structure

Recommended 90 to 120 seconds:

1. Problem, 10 seconds:
   "Students do not just need networking advice. They need a safe place to rehearse the moment before they speak."

2. Onboarding, 20 seconds:
   Show theater ticket, Maya scene, stage role, social goal.

3. Mission, 20 seconds:
   Show Coffee chat practice, Jordan Lee, personal goal, strategy.

4. Voice practice, 30 seconds:
   Show user speaking and Jordan responding in a short coffee chat.

5. Review, 20 seconds:
   Show highlight quote, smaller rewrite, Done.

6. Close, 10 seconds:
   "Uply turns awkward social moments into practice scenes you can repeat before real life."
