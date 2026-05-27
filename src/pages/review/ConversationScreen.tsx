import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, FileImage, Headphones } from "lucide-react";
import { User, MapPin } from "lucide-react";

const TODO_DEFAULT_TEXT = "Send a follow-up email to Professor Chen";

export interface Message {
  role: "user" | "system";
  text?: string;
  isImage?: boolean;
  isAudio?: boolean;
  uploadName?: string;
  uploadMeta?: string;
  uploadKind?: "image" | "audio";
  choices?: string[];
}

export interface ConvRecord {
  target: string;
  location: string;
  title: string;
  messages: Message[];
}

export const CONVERSATIONS: ConvRecord[] = [
  {
    target: "Alumni", location: "LinkedIn",
    title: "Reached out to CS senior on LinkedIn",
    messages: [
      { role: "user", isImage: true },
      { role: "user",   text: "I messaged a CS senior and asked whether he could share any interview questions from AB Company. He hasn't replied in three days. Did I say something wrong?" },
      { role: "system", text: "I don't see any major mistakes. Your message is polite and easy to understand. If I were to improve one thing, I'd make it slightly less request-focused. For example, you could briefly mention why you're reaching out to him specifically before asking for help.\n\nThat said, three days without a reply is completely normal on LinkedIn. Many people simply don't check their messages often." },
      { role: "user",   text: "Should I send a follow-up message?" },
      { role: "system", text: "I'd wait a few more days first. If there's still no response after about a week, a short follow-up is perfectly acceptable.\n\nSomething like:\n\n\"Hi Jason, just wanted to follow up on my previous message in case it got buried. No worries if you're busy. I'd still love to hear about your experience at AB Company whenever you have time.\"\n\nThe key takeaway from this screenshot is that your message wasn't a failure. There are small ways to make it stronger, but nothing here suggests you made a negative impression." },
    ],
  },
  {
    target: "Recruiter", location: "Email",
    title: "Follow-up after first-round interview",
    messages: [
      { role: "user",   isAudio: true },
      { role: "system", text: "Would you like me to generate a text transcript of this recording for review?", choices: ["No", "Yes"] },
      { role: "user",   text: "No" },
      { role: "system", text: "No problem! Go ahead and describe your situation, and I'll help you from there." },
      { role: "user",   text: "I want to write a follow-up email after my first-round interview. It went well — we talked a lot about my internship experience. Should I mention specific projects?" },
      { role: "system", text: "Yes, mention one specific project briefly. It shows you were engaged and helps the interviewer remember you.\n\nFor example:\n\n\"I particularly enjoyed our conversation about the data pipeline challenge — my internship gave me direct experience with a similar ETL project.\"\n\nThen close with something simple like: \"I look forward to hearing about next steps.\"" },
      { role: "user",   text: "Should I send it today or wait a bit?" },
      { role: "system", text: "Send it today if you can — ideally within 24 hours while the conversation is still fresh.\n\nIf it's already been a day or more, send it now rather than delaying further. A slightly late follow-up is far better than none at all." },
    ],
  },
  {
    target: "Professor", location: "Campus",
    title: "Asked for a research opportunity intro",
    messages: [
      { role: "user",   text: "I emailed Professor Chen asking if I could join her research lab. She replied asking for my CV. Is that a good sign?" },
      { role: "system", text: "That's a positive sign. Asking for your CV means she's taking your request seriously.\n\nMake sure it highlights any relevant coursework, projects, or skills related to her research area, even if they're small." },
      { role: "user",   text: "How should I write the email attaching my CV?" },
      { role: "system", text: "Keep it concise:\n\n\"Dear Professor Chen, thank you for getting back to me. Please find my CV attached. I've highlighted my NLP coursework and a sentiment analysis project I completed last semester. I'd love the chance to contribute to your research and am happy to discuss further at your convenience.\"\n\nThis shows initiative without being overbearing." },
    ],
  },
];

function Tag({ icon: Icon, label, bg, color }: { icon: React.ElementType; label: string; bg: string; color: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: bg, borderRadius: 20, padding: "3px 9px" }}>
      <Icon size={10} color={color} strokeWidth={2} />
      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "10px", color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        maxWidth: "80%",
        background: "#fffdf2",
        border: "2px solid #FFCF4A",
        borderRadius: "18px 18px 4px 18px",
        padding: "10px 14px",
      }}>
        {children}
      </div>
    </div>
  );
}

function SystemBubble({
  text,
  highlighted = false,
  clickable = false,
  onClick,
}: {
  text: string;
  highlighted?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}) {
  const paragraphs = text.split("\n\n");
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{
        maxWidth: "82%",
        background: "white",
        border: "2px solid #6B63D4",
        borderRadius: "18px 18px 18px 4px",
        padding: "12px 14px",
        cursor: clickable ? "pointer" : "default",
        boxShadow: highlighted
          ? "0 0 0 6px rgba(107,99,212,0.14), 0 10px 24px rgba(67,57,168,0.18)"
          : "none",
        transition: "box-shadow .2s ease, transform .2s ease",
        transform: highlighted ? "translateY(-1px)" : "none",
      }} onClick={onClick}>
        {paragraphs.map((para, i) => {
          const isQuote = para.startsWith('"Hi') || para.startsWith('"Dear') || para.startsWith('"');
          return (
            <p key={i} style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              color: isQuote ? "#6B63D4" : "#1a1830",
              lineHeight: 1.55,
              margin: 0,
              marginTop: i > 0 ? 10 : 0,
              fontStyle: isQuote ? "italic" : "normal",
              paddingLeft: isQuote ? 8 : 0,
              borderLeft: isQuote ? "2px solid #c4bfee" : "none",
            }}>
              {para}
            </p>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  index: number;
  onBack: () => void;
  customConversation?: ConvRecord | null;
  onTodoGenerated?: (todoText: string) => void;
}

export function ConversationScreen({ index, onBack, customConversation = null, onTodoGenerated }: Props) {
  const conv = useMemo(
    () => customConversation ?? CONVERSATIONS[index],
    [customConversation, index],
  );
  const [messages, setMessages] = useState<Message[]>(conv.messages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTodoBubbleIndex, setSelectedTodoBubbleIndex] = useState<number | null>(null);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [todoDraft, setTodoDraft] = useState(TODO_DEFAULT_TEXT);
  const [todoToastVisible, setTodoToastVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const todoToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMessages(conv.messages);
    setDraft("");
    setSending(false);
    setSelectedTodoBubbleIndex(null);
    setTodoModalOpen(false);
    setTodoToastVisible(false);
    setTodoDraft(TODO_DEFAULT_TEXT);
    if (todoToastTimerRef.current) {
      clearTimeout(todoToastTimerRef.current);
      todoToastTimerRef.current = null;
    }
  }, [conv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  useEffect(() => {
    return () => {
      if (todoToastTimerRef.current) {
        clearTimeout(todoToastTimerRef.current);
        todoToastTimerRef.current = null;
      }
    };
  }, []);

  const canSend = draft.trim().length > 0 && !sending;
  const canGenerateTodo = todoDraft.trim().length > 0;

  const sendChat = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setDraft("");
    setSending(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => typeof m.text === "string" && m.text.trim().length > 0)
        .slice(-16)
        .map((m) => ({ role: m.role, text: m.text ?? "" }));
      const res = await fetch("/api/review-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: conv.target,
          location: conv.location,
          title: conv.title,
          messages: apiMessages,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`review-chat ${res.status}: ${body.slice(0, 140)}`);
      }
      const payload = await res.json();
      const reply = typeof payload?.reply === "string" && payload.reply.trim()
        ? payload.reply.trim()
        : "I reviewed your update. Share one specific goal and I can refine the exact wording for you.";
      setMessages((prev) => [...prev, { role: "system", text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown network error";
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: `I could not reach the chat model right now. (${message})`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const openTodoModal = () => {
    setTodoDraft(TODO_DEFAULT_TEXT);
    setTodoModalOpen(true);
  };

  const handleGenerateTodo = () => {
    const trimmed = todoDraft.trim();
    if (trimmed) {
      onTodoGenerated?.(trimmed);
    }
    setTodoModalOpen(false);
    setTodoToastVisible(true);
    if (todoToastTimerRef.current) {
      clearTimeout(todoToastTimerRef.current);
    }
    todoToastTimerRef.current = setTimeout(() => {
      setTodoToastVisible(false);
      todoToastTimerRef.current = null;
    }, 2800);
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "#f0ede8", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        background: "white",
        padding: "52px 16px 14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <button
            onClick={onBack}
            style={{ width: 34, height: 34, borderRadius: "50%", background: "#f0eeff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <ChevronLeft size={18} color="#6B63D4" strokeWidth={2} />
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            <Tag icon={User}   label={conv.target}   bg="#f0edff" color="#6B63D4" />
            <Tag icon={MapPin} label={conv.location} bg="#fff8ec" color="#c47a0e" />
          </div>
        </div>
        <div style={{ paddingLeft: 46 }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1830", lineHeight: 1.4 }}>
            {conv.title}
          </div>
        </div>
      </div>

      {/* ── Chat messages ── */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px 154px" } as React.CSSProperties}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(() => {
            let systemBubbleCount = 0;
            return messages.map((msg, i) => {
              const isSystemMessage = msg.role === "system";
              if (isSystemMessage) systemBubbleCount += 1;
              const isSecondSystemBubble = isSystemMessage && systemBubbleCount === 2;
              const isTodoBubbleSelected = selectedTodoBubbleIndex === i && isSecondSystemBubble;

              const handleTodoBubbleTap = () => {
                if (!isSecondSystemBubble) return;
                setSelectedTodoBubbleIndex(i);
              };

              if (msg.role === "user" && msg.isImage) {
                const uploadKind = msg.uploadKind ?? "image";
                return (
                  <UserBubble key={i}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "white",
                        borderRadius: 12,
                        padding: "10px 12px",
                        border: "1px solid #e5e1f2",
                        minWidth: 220,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#eef1ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                          {uploadKind === "audio"
                            ? <Headphones size={16} color="#7f7ad6" strokeWidth={1.8} />
                            : <FileImage size={16} color="#7f7ad6" strokeWidth={1.8} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            fontSize: "12px",
                            color: "#1a1830",
                            lineHeight: 1.2,
                          }}
                        >
                          {msg.uploadName ?? "LinkedIn-screenshot.jpg"}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 500,
                            fontSize: "11px",
                            color: "#9896b8",
                            marginTop: 2,
                          }}
                        >
                          {msg.uploadMeta ?? "JPG 1.22MB · Uploaded"}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#6B63D4",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                    </div>
                  </UserBubble>
                );
              }
              if (msg.role === "user" && msg.isAudio) {
                const uploadKind = msg.uploadKind ?? "audio";
                return (
                  <UserBubble key={i}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "white",
                        borderRadius: 12,
                        padding: "10px 12px",
                        border: "1px solid #e5e1f2",
                        minWidth: 220,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#f2efff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                          {uploadKind === "image"
                            ? <FileImage size={16} color="#7f7ad6" strokeWidth={1.8} />
                            : <Headphones size={16} color="#7f7ad6" strokeWidth={1.8} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            fontSize: "12px",
                            color: "#1a1830",
                            lineHeight: 1.2,
                          }}
                        >
                          {msg.uploadName ?? "Follow-up-voice-note.m4a"}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 500,
                            fontSize: "11px",
                            color: "#9896b8",
                            marginTop: 2,
                          }}
                        >
                          {msg.uploadMeta ?? "M4A 139.72KB · Uploaded"}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#6B63D4",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                    </div>
                  </UserBubble>
                );
              }
              if (msg.role === "user") {
                return (
                  <UserBubble key={i}>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "13px", color: "#1a1830", lineHeight: 1.55 }}>
                      {msg.text}
                    </span>
                  </UserBubble>
                );
              }
              if (msg.choices) {
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div
                        onClick={isSecondSystemBubble ? handleTodoBubbleTap : undefined}
                        style={{
                          maxWidth: "82%",
                          background: "white",
                          border: "2px solid #6B63D4",
                          borderRadius: "18px 18px 18px 4px",
                          padding: "12px 14px",
                          cursor: isSecondSystemBubble ? "pointer" : "default",
                          boxShadow: isTodoBubbleSelected
                            ? "0 0 0 6px rgba(107,99,212,0.14), 0 10px 24px rgba(67,57,168,0.18)"
                            : "none",
                          transition: "box-shadow .2s ease, transform .2s ease",
                          transform: isTodoBubbleSelected ? "translateY(-1px)" : "none",
                        }}
                      >
                        <p style={{
                          fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "13px",
                          color: "#1a1830", lineHeight: 1.55, margin: 0,
                        }}>
                          {msg.text}
                        </p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                          <button style={{
                            padding: "7px 20px", borderRadius: 20,
                            border: "1.5px solid #e0dced", background: "white", cursor: "default",
                            fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "13px", color: "#b8b4d0",
                          }}>
                            No
                          </button>
                          <button style={{
                            padding: "7px 20px", borderRadius: 20,
                            border: "none", background: "#6B63D4", cursor: "default",
                            fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "13px", color: "white",
                          }}>
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                    {isSecondSystemBubble && (
                      <button
                        onClick={openTodoModal}
                        style={{
                          marginTop: 8,
                          marginLeft: 4,
                          border: "none",
                          borderRadius: 999,
                          background: "#6B63D4",
                          color: "white",
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700,
                          fontSize: "12px",
                          letterSpacing: "0.02em",
                          padding: "9px 14px",
                          cursor: "pointer",
                          boxShadow: "0 8px 18px rgba(67,57,168,0.25)",
                          opacity: isTodoBubbleSelected ? 1 : 0,
                          transform: isTodoBubbleSelected ? "translateY(0)" : "translateY(-8px)",
                          pointerEvents: isTodoBubbleSelected ? "auto" : "none",
                          transition: "opacity .24s ease, transform .24s ease",
                        }}
                      >
                        Generate To-Do
                      </button>
                    )}
                  </div>
                );
              }
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <SystemBubble
                    text={msg.text!}
                    highlighted={isTodoBubbleSelected}
                    clickable={isSecondSystemBubble}
                    onClick={isSecondSystemBubble ? handleTodoBubbleTap : undefined}
                  />
                  {isSecondSystemBubble && (
                    <button
                      onClick={openTodoModal}
                      style={{
                        marginTop: 8,
                        marginLeft: 4,
                        border: "none",
                        borderRadius: 999,
                        background: "#6B63D4",
                        color: "white",
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                        padding: "9px 14px",
                        cursor: "pointer",
                        boxShadow: "0 8px 18px rgba(67,57,168,0.25)",
                        opacity: isTodoBubbleSelected ? 1 : 0,
                        transform: isTodoBubbleSelected ? "translateY(0)" : "translateY(-8px)",
                        pointerEvents: isTodoBubbleSelected ? "auto" : "none",
                        transition: "opacity .24s ease, transform .24s ease",
                      }}
                    >
                      Generate To-Do
                    </button>
                  )}
                </div>
              );
            });
          })()}
          <div ref={bottomRef} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 14,
          zIndex: 70,
          border: "6px solid #6B63D4",
          borderRadius: 28,
          background: "#6B63D4",
          padding: 6,
          boxShadow: "0 8px 20px rgba(67,57,168,0.16)",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "10px 10px 10px 14px",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            minHeight: 60,
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply here..."
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendChat();
              }
            }}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              minHeight: 24,
              maxHeight: 96,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 500,
              fontSize: 13,
              color: "#1a1830",
              lineHeight: 1.45,
              background: "transparent",
            }}
          />
          <button
            onClick={() => void sendChat()}
            disabled={!canSend}
            aria-label="Send message"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: canSend ? "#FFCF4A" : "#f2e7bd",
              color: canSend ? "white" : "#e0c783",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canSend ? "pointer" : "default",
              flexShrink: 0,
            }}
          >
            <ArrowUp size={18} strokeWidth={2.3} />
          </button>
        </div>

      </div>

      {todoModalOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 88,
            background: "rgba(10,8,30,0.58)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              borderRadius: 22,
              background: "white",
              padding: "18px 16px 14px",
              boxShadow: "0 18px 34px rgba(8,4,40,0.35)",
              animation: "uply-fade-up .24s ease",
            }}
          >
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 22,
                color: "#1a1830",
                lineHeight: 1.1,
              }}
            >
              Generate To-Do
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
                fontSize: 13,
                color: "#7c78a1",
                lineHeight: 1.4,
              }}
            >
              Create a reminder from this conversation.
            </div>
            <textarea
              value={todoDraft}
              onChange={(e) => setTodoDraft(e.target.value)}
              style={{
                marginTop: 12,
                width: "100%",
                minHeight: 110,
                resize: "vertical",
                borderRadius: 14,
                border: "1.5px solid rgba(107,99,212,0.26)",
                padding: "10px 12px",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: 1.45,
                color: "#1a1830",
                outline: "none",
              }}
            />
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setTodoModalOpen(false)}
                style={{
                  border: "1.5px solid rgba(107,99,212,0.28)",
                  borderRadius: 999,
                  background: "white",
                  color: "#6B63D4",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateTodo}
                disabled={!canGenerateTodo}
                style={{
                  border: "none",
                  borderRadius: 999,
                  background: canGenerateTodo ? "#6B63D4" : "#cfc9ef",
                  color: "white",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "8px 14px",
                  cursor: canGenerateTodo ? "pointer" : "default",
                }}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {todoToastVisible && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 96,
            zIndex: 90,
            borderRadius: 14,
            background: "#1d1733",
            color: "white",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 12px 28px rgba(8,4,40,0.35)",
            animation: "uply-fade-up .2s ease",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#FFCF4A",
              color: "#2e1d00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            This reminder has been added to your desktop.
          </div>
        </div>
      )}
    </div>
  );
}
