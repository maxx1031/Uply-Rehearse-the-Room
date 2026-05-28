# Uply (｡･ω･｡)ﾉ♡

> **Networking is a stage. Uply helps rehearse.**

Uply is a low-pressure space that helps students and newcomers practice networking conversations with AI. While shaping your career, you could also gain real-world confidence.

## Try It Now

- **Live demo:** https://uply-gilt.vercel.app
- **Demo video:** watch the product loop below.

<video src="docs/demo/uply-demo.mp4" controls width="360"></video>

---

## 🚀 Inspiration

Many people hesitate when seeking opportunities because they do not know how to begin. They fear awkward silences, saying the wrong thing, or completely failing an important conversation (´･_･`), wishing they had guidance in the moment or a chance to try again.

Uply exists to provide that space: a low-pressure environment where users can **rehearse, reflect, and build confidence** before stepping into real-world interactions.

---

## 🎭 What It Does

The current demo focuses on a **complete user loop**:

1. **Enter the stage** ✨, New users step into Uply's theatrical world and experience a short AI-powered conversation.
2. **Get instant feedback** 📝, They receive immediate analysis right after.
3. **Start learning** 🎯, Guided to the home page to begin their first series, *"Self-Introduction,"* completing small challenges.
4. **Reflect & review** 🔍, A reflection feature reviews performance, analyzes communication style, and gives personalized guidance.
5. **Act in real life** 🌱, Clear next-step suggestions (send a follow-up, schedule another chat) auto-convert into a **to-do list** on the home page.

> By creating a continuous loop between in-app rehearsal and real-world practice, Uply helps users gradually build both communication skills and confidence. We cheer them on the whole way ٩(◕‿◕)۶

---

## 💪 How We Built It

A **mobile-first React web app** with a theater-inspired design system.

**Frontend stack** 🛠️
React 18 · Vite · TypeScript · Tailwind · motion/react · lucide-react · React Router

**Voice practice flow** 🎙️

- Powered by **OpenAI Realtime over WebRTC**
- The browser never receives the main API key (´｡• ω •｡`)
- A Vercel-style `/api/realtime-token` endpoint mints a **short-lived client secret** per session
- The mission flow sends a profile-derived prompt seed so the AI partner stays in character and guides a focused coffee chat

**The `OnboardingProfile` contract** 📇
We designed a small product contract that converts onboarding choices into:

- The user's selected social goal
- A stage role
- Strengths and practice focus
- The first lesson prompt seed
- Success criteria for the practice session

---

## ⛰️ Challenges We Ran Into

- **Real rehearsal, not a generic chatbot**, The AI partner had to stay in character, keep conversations natural and emotionally believable, and avoid feeling like a test or evaluation system.
- **Support vs. action** (；・∀・), Balancing emotional encouragement inside the app while still pushing users to step outside the safe space into real networking conversations.

---

## 🌟 Accomplishments We're Proud Of

Uply is **not just a static concept**. It has a complete end-to-end practice loop. Three things we love most:

- 🎭 Turning social practice into a low-pressure **theater metaphor** that feels warmer than a productivity tool.
- 🔗 Building a **profile-to-practice pipeline** where onboarding choices shape the first rehearsal.
- ✂️ Creating a lightweight review that gives **"one useful next sentence"** instead of overwhelming feedback.

---

## 🧠 What We Learned

> The most important part of an AI coach is **restraint**.

- For social skills, more feedback is not always better. A nervous user does not need a report card (｡•́︿•̀｡). They need one safe repetition, one specific line they said well, and one smaller way to say the next thing.
- **Voice AI needs product design around it.** Realtime voice is powerful, but it only works when scene, task, partner persona, exit rules, pause rules, and review loop all support the same emotional promise.
- **Personalization does not need a huge memory system.** Even a small onboarding profile makes a first session feel relevant when translated carefully into mission and prompt design.

---

## 🔮 What's Next for Uply

Making Uply more **personal, continuous, and useful** in real social situations.

| | Feature | What It Does |
|---|---|---|
| 💬 | **Smarter Conversation Review** | Sharper highlights and personalized rewrite suggestions from real transcripts. |
| 🎬 | **More Real-World Practice Scenes** | Beyond coffee chats: asking for help, follow-ups, group conversations, LinkedIn openers. |
| 🐣 | **Companion System** | In-app companions to casually talk with, release pressure, and build comfort. |
| 📊 | **Personal Growth Profile** | Revisit memory cards, track communication patterns, collect refined notes, drafts, and social insights over time. |

---

*Uply, step onto the stage, one rehearsal at a time. ✨(๑•̀ㅂ•́)و✧*
