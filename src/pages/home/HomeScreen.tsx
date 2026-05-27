import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, User, MessageCircle, ScrollText, Drama, Play } from "lucide-react";
import statCalendar from "@/assets/imports/1.png";
import statStar from "@/assets/imports/3.png";
import sceneImg from "@/assets/imports/Gemini_Generated_Image_lbtprrlbtprrlbtp.png";
import you2Img from "@/assets/imports/you2.png";
import { ProfileScreen } from "@/pages/profile/ProfileScreen";
import { LearnScreen } from "../learn/LearnScreen";
import { ReviewScreen } from "@/pages/review/ReviewScreen";
import { FIRST_LESSON_SCENE_TITLE } from "@/lib/onboardingProfile";
import { PROFILE_CONSTANTS } from "@/lib/profileConfig";
import {
  buildInitialCourseProgress,
  buildInitialIntroMemory,
  getCurrentLesson,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
} from "@/lib/selfIntroCourse";

export type HomeTab = "home" | "learn" | "review" | "profile";

const TAB_ITEMS: { icon: React.ElementType; key: HomeTab }[] = [
  { icon: Drama,         key: "home"    },
  { icon: ScrollText,    key: "learn"   },
  { icon: MessageCircle, key: "review"  },
  { icon: User,          key: "profile" },
];

const DEFAULT_HOME_TODOS = [
  "Review one LinkedIn opener before noon",
  "Send one warm follow-up message after coffee chat",
  "Draft a 3-line thank-you note for a mentor",
];

const HOME_TODO_STORAGE_KEY = "uply.review.todos";

function SprocketStrip() {
  return (
    <div style={{
      background: "#3b34b0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 10px",
    }}>
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={i}
          style={{ width: 20, height: 14, borderRadius: 4, background: "rgba(185,175,240,0.55)" }}
        />
      ))}
    </div>
  );
}

interface HomeScreenProps {
  /** Tap a module card or the featured scene play button. App routes this to
   *  the practice / conversation flow. */
  onStartMission?: () => void;
  debugModeEnabled?: boolean;
  onSetCompletedLessons?: (value: number) => void;
  /** Optional restart of the whole onboarding (kept for legacy parity). */
  onRestart?: () => void;
  userName?: string;
  progress?: CourseProgress;
  memory?: IntroMemory;
  score?: number;
  streak?: number;
  initialTab?: HomeTab;
  onStartLesson?: (lessonId: CourseLessonId) => void;
}

export function HomeScreen({
  onStartMission,
  debugModeEnabled = false,
  onSetCompletedLessons,
  userName = PROFILE_CONSTANTS.defaultUserName,
  progress = buildInitialCourseProgress(),
  memory = buildInitialIntroMemory(),
  score = 14000,
  streak = 10,
  initialTab = "home",
  onStartLesson,
}: HomeScreenProps = {}) {
  void onStartMission;
  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab);
  const [todos, setTodos] = useState<Array<{ id: number; text: string; date: string }>>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadTodos = () => {
      const raw = window.localStorage.getItem(HOME_TODO_STORAGE_KEY);
      if (!raw) {
        setTodos(DEFAULT_HOME_TODOS.map((text, idx) => ({ id: idx + 1, text, date: "Added today" })));
        window.localStorage.setItem(HOME_TODO_STORAGE_KEY, JSON.stringify(DEFAULT_HOME_TODOS));
      } else {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setTodos(
              parsed.map((text, idx) => ({
                id: idx + 1,
                text: String(text),
                date: "Added from review",
              })),
            );
          } else {
            setTodos(DEFAULT_HOME_TODOS.map((text, idx) => ({ id: idx + 1, text, date: "Added today" })));
            window.localStorage.setItem(HOME_TODO_STORAGE_KEY, JSON.stringify(DEFAULT_HOME_TODOS));
          }
        } catch {
          setTodos(DEFAULT_HOME_TODOS.map((text, idx) => ({ id: idx + 1, text, date: "Added today" })));
          window.localStorage.setItem(HOME_TODO_STORAGE_KEY, JSON.stringify(DEFAULT_HOME_TODOS));
        }
      }
    };
    loadTodos();
    const onUpdated = () => loadTodos();
    window.addEventListener("uply:todos-updated", onUpdated);
    return () => window.removeEventListener("uply:todos-updated", onUpdated);
  }, []);

  const handleCompleteTodo = (id: number) => {
    setTodos((prev) => {
      const nextTodos = prev.filter((todo) => todo.id !== id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          HOME_TODO_STORAGE_KEY,
          JSON.stringify(nextTodos.map((todo) => todo.text)),
        );
        window.dispatchEvent(
          new CustomEvent("uply:todos-updated", { detail: nextTodos.map((todo) => todo.text) }),
        );
      }
      return nextTodos;
    });
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: "#f0ede8" }}>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === "profile" ? (
          <ProfileScreen userName={userName} onBack={() => setActiveTab("home")} />
        ) : activeTab === "learn" ? (
          <LearnScreen
            progress={progress}
            memory={memory}
            onStartLesson={onStartLesson ?? (() => {})}
            debugModeEnabled={debugModeEnabled}
            onSetCompletedLessons={onSetCompletedLessons}
          />
        ) : activeTab === "review" ? (
          <ReviewScreen />
        ) : (
          <div className="absolute inset-0 overflow-y-auto" style={{ paddingBottom: 96, scrollbarWidth: "none" }}>

            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between"
              style={{ padding: "58px 20px 18px" }}
            >
              <div className="flex items-center gap-3">
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "linear-gradient(135deg, #7c73e6, #5b52cc)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(107,99,212,0.3)",
                }}>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "18px", color: "white" }}>U</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {PROFILE_CONSTANTS.homeGreeting}
                  </div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "20px", color: "#1a1830", lineHeight: 1.1 }}>
                    {userName}
                  </div>
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f0ede8", borderRadius: 20, padding: "6px 12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <img src={statCalendar} alt="" aria-hidden style={{ width: 16, height: 16, objectFit: "contain" }} />
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1830" }}>{streak} days</span>
                <div style={{ width: 1, height: 12, background: "#c8c4d8" }} />
                <img src={statStar} alt="" aria-hidden style={{ width: 16, height: 16, objectFit: "contain" }} />
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1830" }}>{score.toLocaleString()}</span>
              </div>
            </motion.div>

            {/* ── Film Reel Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ margin: "0 16px 18px" }}
            >
              <div style={{
                borderRadius: 20,
                background: "#4f46c8",
                overflow: "hidden",
                boxShadow: "0 10px 36px rgba(60,40,160,0.28)",
              }}>
                {/* Title row */}
                <div style={{ padding: "12px 14px 8px" }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                    {FIRST_LESSON_SCENE_TITLE}
                  </div>
                </div>

                {/* Top sprocket strip */}
                <SprocketStrip />

                {/* Single scene frame — 9.jpg fills it */}
                <div style={{
                  position: "relative",
                  height: 160,
                  overflow: "hidden",
                }}>
                  <img
                    src={sceneImg}
                    alt=""
                    aria-hidden
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {/* Subtle overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(30,20,80,0.15)" }} />

                  {/* Play button centered */}
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <button
                      onClick={() => onStartLesson?.(getCurrentLesson(progress).id)}
                      style={{
                        width: 68, height: 68, borderRadius: "50%",
                        background: "rgba(255,255,255,0.28)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Play size={30} color="white" fill="white" style={{ marginLeft: 4 }} />
                    </button>
                  </div>
                </div>

                {/* Bottom sprocket strip */}
                <SprocketStrip />

                {/* Progress indicator — 1 of 4 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 0 12px" }}>
                  <div style={{ width: 22, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.88)" }} />
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.28)" }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Speech bubble from Luna ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{ margin: "0 16px 22px", display: "flex", alignItems: "center", gap: 10 }}
            >
              {/* Bubble — narrowed so left edge ~aligns with Networking label */}
              <div style={{ flex: 1, position: "relative", marginLeft: 44 }}>
                <div style={{
                  background: "#FFCF4A",
                  borderRadius: 18,
                  padding: "13px 16px",
                }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: "15px", color: "#2a1f0e", lineHeight: 1.45 }}>
                    You're not "being fake", you're prepping!
                  </div>
                </div>
                {/* Tail pointing right toward avatar */}
                <div style={{
                  position: "absolute",
                  right: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0, height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: "11px solid #FFCF4A",
                }} />
              </div>

              {/* Avatar — larger */}
              <img
                src={you2Img}
                alt="Luna"
                style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            </motion.div>

            {/* ── To-Do list ── */}
            <div style={{ padding: "0 16px" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "11px", color: "#9896b8", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  To-Do List
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <AnimatePresence initial={false}>
                    {todos.slice(0, 4).map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.22 } }}
                        transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
                        style={{
                          background: "white",
                          borderRadius: 16,
                          padding: "13px 14px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1830", lineHeight: 1.4 }}>
                            {todo.text}
                          </div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "10px", color: "#c0bcd8", marginTop: 4 }}>
                            {todo.date}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleCompleteTodo(todo.id)}
                          whileTap={{ scale: 0.82, backgroundColor: "#6B63D4", borderColor: "#6B63D4" }}
                          transition={{ type: "spring", stiffness: 500, damping: 22 }}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: "#f0eeff",
                            border: "2px solid #d4cfee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Check size={15} color="#6B63D4" strokeWidth={2.5} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {todos.length === 0 && (
                    <div style={{
                      background: "white",
                      borderRadius: 16,
                      padding: "20px 14px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                      textAlign: "center",
                    }}>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "16px", color: "#c4bfee" }}>
                        All done! 🎉
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        position: "absolute", bottom: 16, left: 24, right: 24,
        height: 64,
        background: "#f0ede8",
        borderRadius: 20,
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        zIndex: 50,
      }}>
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 5,
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              <Icon size={26} color={isActive ? "#6B63D4" : "#9896b8"} strokeWidth={isActive ? 2.2 : 1.8} />
              {isActive && (
                <div style={{ width: 18, height: 3, borderRadius: 2, background: "#6B63D4", marginTop: -2 }} />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
