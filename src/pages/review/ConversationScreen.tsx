import { ChevronLeft, FileImage, Headphones } from "lucide-react";
import { User, MapPin } from "lucide-react";

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

function SystemBubble({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{
        maxWidth: "82%",
        background: "white",
        border: "2px solid #6B63D4",
        borderRadius: "18px 18px 18px 4px",
        padding: "12px 14px",
      }}>
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
}

export function ConversationScreen({ index, onBack, customConversation = null }: Props) {
  const conv = customConversation ?? CONVERSATIONS[index];

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
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px 110px" } as React.CSSProperties}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {conv.messages.map((msg, i) => {
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
                <div key={i} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    maxWidth: "82%",
                    background: "white",
                    border: "2px solid #6B63D4",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "12px 14px",
                  }}>
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
              );
            }
            return <SystemBubble key={i} text={msg.text!} />;
          })}
        </div>
      </div>
    </div>
  );
}
