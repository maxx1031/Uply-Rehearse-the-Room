import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Coffee, Drama, Flame, HeartHandshake, MessageCircle, MessageSquare, Play, ScrollText, Sparkles, Star, User, Users } from "lucide-react";
import sceneImg from "@/assets/imports/Gemini_Generated_Image_lbtprrlbtprrlbtp.png";
import you2Img from "@/assets/imports/you2.png";
import { LearnScreen } from "@/pages/learn/LearnScreen";
import { ProfileScreen } from "@/pages/profile/ProfileScreen";
import { ReviewScreen } from "@/pages/review/ReviewScreen";
import {
  getCurrentLesson,
  type CourseLessonId,
  type CourseProgress,
  type IntroMemory,
} from "@/lib/selfIntroCourse";
import styles from "./HomeScreen.module.css";

export type HomeTab = "home" | "learn" | "review" | "profile";

const TAB_ITEMS: { icon: React.ElementType; key: HomeTab; label: string }[] = [
  { icon: Drama, key: "home", label: "Home" },
  { icon: ScrollText, key: "learn", label: "Learn" },
  { icon: MessageCircle, key: "review", label: "Review" },
  { icon: User, key: "profile", label: "Profile" },
];

const MODULES = [
  { Icon: MessageSquare, title: "LinkedIn Opener", subtitle: "Warm first message", type: "Friendly alumni", duration: "8 min", tone: "lavender" },
  { Icon: Coffee, title: "AI PM Coffee Chat", subtitle: "Ask one focused AI question", type: "Alumni mentor", duration: "10 min", tone: "gold" },
  { Icon: HeartHandshake, title: "Post-Chat Thank You", subtitle: "Recap and stay in touch", type: "Recent mentor", duration: "6 min", tone: "lavender" },
  { Icon: Sparkles, title: "Quiet Reconnect", subtitle: "Restart after months silent", type: "Old classmate", duration: "5 min", tone: "gold" },
];

interface HomeScreenProps {
  progress: CourseProgress;
  memory: IntroMemory;
  score: number;
  streak: number;
  initialTab?: HomeTab;
  onStartLesson: (lessonId: CourseLessonId) => void;
}

export function HomeScreen({
  progress,
  memory,
  score,
  streak,
  initialTab = "home",
  onStartLesson,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab);
  const currentLesson = getCurrentLesson(progress);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {activeTab === "profile" ? (
          <ProfileScreen
            onBack={() => setActiveTab("home")}
          />
        ) : activeTab === "learn" ? (
          <LearnScreen progress={progress} memory={memory} onStartLesson={onStartLesson} />
        ) : activeTab === "review" ? (
          <ReviewScreen />
        ) : (
          <div className={styles.homeScroll}>
            <motion.header
              className={styles.header}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className={styles.userRow}>
                <div className={styles.logoMark}>U</div>
                <div>
                  <div className={styles.eyebrow}>WELCOME BACK</div>
                  <div className={styles.userName}>Max</div>
                </div>
              </div>
              <div className={styles.statPill}>
                <span><Flame size={14} fill="currentColor" />{streak}</span>
                <span><Star size={14} fill="currentColor" />{score}</span>
              </div>
            </motion.header>

            <motion.section
              className={styles.heroCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.08 }}
            >
              <div className={styles.heroImage}>
                <img src={sceneImg} alt="" aria-hidden />
                <div className={styles.heroShade} />
                <div className={styles.levelBadge}>Level {currentLesson.level}</div>
              </div>
              <div className={styles.heroBody}>
                <div className={styles.eyebrow}>TODAY'S REHEARSAL</div>
                <h1>{currentLesson.title}</h1>
                <p>{currentLesson.subtitle}</p>
                <button className={styles.primaryButton} onClick={() => onStartLesson(currentLesson.id)}>
                  <Play size={17} fill="currentColor" />
                  Curtain up
                </button>
              </div>
            </motion.section>

            <motion.section
              className={styles.lunaRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
            >
              <div className={styles.lunaBubble}>
                <p>You're not "being fake", you're prepping!</p>
              </div>
              <img className={styles.lunaAvatar} src={you2Img} alt="Luna" />
            </motion.section>

            <section className={styles.moduleSection}>
              <div className={styles.moduleLabel}>Networking Modules</div>
              <div className={styles.moduleList}>
                {MODULES.map((mod, index) => {
                  const Icon = mod.Icon;
                  return (
                    <motion.button
                      key={mod.title}
                      className={styles.moduleCard}
                      onClick={() => onStartLesson(currentLesson.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.22 + index * 0.06 }}
                    >
                      <span className={`${styles.moduleIcon} ${mod.tone === "gold" ? styles.moduleIconGold : ""}`}>
                        <Icon size={20} strokeWidth={1.7} />
                      </span>
                      <span className={styles.moduleText}>
                        <span className={styles.moduleTitle}>{mod.title}</span>
                        <span className={styles.moduleSubtitle}>{mod.subtitle}</span>
                        <span className={styles.moduleMeta}>
                          <Users size={10} strokeWidth={1.8} />
                          {mod.type} · {mod.duration}
                        </span>
                      </span>
                      <span className={styles.rehearsePill}>
                        <Play size={10} fill="currentColor" />
                        Rehearse
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      <nav className={styles.tabBar} aria-label="Primary navigation">
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={styles.tabButton}
              onClick={() => setActiveTab(tab.key)}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={26} strokeWidth={isActive ? 2.2 : 1.8} />
              {isActive && <span className={styles.activeDot} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
