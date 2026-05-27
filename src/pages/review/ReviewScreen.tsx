import { useState } from "react";
import { Plus, Mic, ArrowUp, Clock, ChevronLeft, ChevronRight, User, MapPin } from "lucide-react";
import bg55 from "@/assets/imports/55.png";
import megaphone from "@/assets/imports/you2.png";
import { ConversationScreen, type ConvRecord } from "./ConversationScreen";

// Single source of truth for the page's brand purple. Used by the input
// frame, dividers and any other accent. Keeps the screen visually unified.
const BRAND_PURPLE = "#5b52cc";

const HISTORY_DATA = [
  {
    period: "Previous 7 days",
    records: [
      { target: "Alumni",    location: "LinkedIn", time: "2 days ago",  title: "Reached out to CS senior on LinkedIn" },
      { target: "Recruiter", location: "Email",    time: "4 days ago",  title: "Follow-up after first-round interview" },
      { target: "Professor", location: "Campus",   time: "6 days ago",  title: "Asked for a research opportunity intro" },
    ],
  },
  {
    period: "Previous 30 days",
    records: [
      { target: "Alumni",    location: "Café",     time: "2 weeks ago", title: "Coffee chat with marketing lead" },
      { target: "Senior",    location: "Event",    time: "3 weeks ago", title: "Met at career fair, sent follow-up" },
      { target: "Recruiter", location: "LinkedIn", time: "3 weeks ago", title: "LinkedIn connection message sent" },
      { target: "Peer",      location: "Campus",   time: "4 weeks ago", title: "Study group networking ask" },
    ],
  },
  {
    period: "April",
    records: [
      { target: "Alumni",    location: "Zoom",   time: "Apr 28", title: "Virtual informational interview prep" },
      { target: "Recruiter", location: "Email",  time: "Apr 22", title: "Cold email to startup founder" },
      { target: "Senior",    location: "Campus", time: "Apr 17", title: "Bumped into lab senior, asked for chat" },
    ],
  },
];

function Tag({ icon: Icon, label, bg, color }: { icon: React.ElementType; label: string; bg: string; color: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, borderRadius: 20,
      padding: "3px 8px",
    }}>
      <Icon size={10} color={color} strokeWidth={2} />
      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "10px", color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </div>
  );
}

function HistoryPanel({ onClose, onOpenConversation }: { onClose: () => void; onOpenConversation: (idx: number) => void }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 40,
        background: "#f0ede8", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "52px 20px 16px", flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "white", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <ChevronLeft size={18} color="#1a1830" strokeWidth={2} />
        </button>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: "#d4cfea" }} />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "11px", color: "#9896b8", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Previous Sessions
          </span>
          <div style={{ flex: 1, height: 1, background: "#d4cfea" }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "0 16px 110px" } as React.CSSProperties}>
        {(() => {
          let globalIdx = 0;
          return HISTORY_DATA.map((section) => (
            <div key={section.period} style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: "18px", color: "#1a1830", marginBottom: 10 }}>
                {section.period}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {section.records.map((rec) => {
                  const idx = globalIdx++;
                  const clickable = idx < 3;
                  return (
                    <div
                      key={idx}
                      onClick={() => clickable && onOpenConversation(idx)}
                      style={{
                        background: "white",
                        borderRadius: 16,
                        padding: "12px 14px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(210,200,245,0.5)",
                        cursor: clickable ? "pointer" : "default",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Tag icon={User}   label={rec.target}   bg="#f0edff" color="#6B63D4" />
                          <Tag icon={MapPin} label={rec.location} bg="#fff8ec" color="#c47a0e" />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "12px", color: "#b8b4d0" }}>{rec.time}</span>
                          {clickable && <ChevronRight size={13} color="#c4c0d8" strokeWidth={2} />}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1830", lineHeight: 1.4 }}>
                        {rec.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

function HistoryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="History"
      style={{
        position: "absolute", top: 52, right: 20, zIndex: 30,
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Clock size={17} color="white" strokeWidth={2} />
    </button>
  );
}

export function ReviewScreen() {
  const [text, setText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [convIndex, setConvIndex] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customConversation, setCustomConversation] = useState<ConvRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = text.trim().length > 0 || selectedFiles.length > 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${bytes}B`;
  };

  const inferUploadKind = (file: File): "image" | "audio" => {
    if (file.type.startsWith("audio/")) return "audio";
    return "image";
  };

  const buildCustomConversation = (query: string, files: File[]): ConvRecord => {
    const hasImage = files.some((f) => inferUploadKind(f) === "image");
    const title = query || (files.length > 1 ? `Uploaded ${files.length} files for review` : "Uploaded file for review");
    const messages: ConvRecord["messages"] = files.map((file) => {
      const uploadKind = inferUploadKind(file);
      const extension = (file.name.split(".").pop() || file.type.split("/").pop() || "file").toUpperCase();
      const uploadMeta = `${extension} ${formatFileSize(file.size)} · Uploaded`;
      return {
        role: "user",
        isImage: uploadKind === "image",
        isAudio: uploadKind === "audio",
        uploadKind,
        uploadName: file.name,
        uploadMeta,
      };
    });
    messages.push({
      role: "system",
      text: "Uploads received. I can help you review tone, clarity, and next-step wording. Tell me what outcome you want from this conversation.",
    });

    return {
      target: "Alumni",
      location: hasImage ? "LinkedIn" : "Email",
      title,
      messages,
    };
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        if (!base64) reject(new Error("Could not read file"));
        else resolve(base64);
      };
      reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  };

  const openFilePicker = (accept: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = true;
    input.onchange = () => {
      const picked = Array.from(input.files ?? []);
      if (!picked.length) return;
      setSelectedFiles((prev) => {
        const map = new Map(prev.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f] as const));
        for (const file of picked) {
          map.set(`${file.name}-${file.size}-${file.lastModified}`, file);
        }
        return Array.from(map.values()).slice(0, 6);
      });
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    if (selectedFiles.length > 0) {
      const query = text.trim();
      setSubmitting(true);
      try {
        const filesPayload = await Promise.all(
          selectedFiles.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            base64: await readFileAsBase64(file),
          })),
        );
        const res = await fetch("/api/review-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: query,
            files: filesPayload,
          }),
        });

        if (!res.ok) {
          const textBody = await res.text();
          throw new Error(`review-advice ${res.status}: ${textBody.slice(0, 120)}`);
        }

        const payload = await res.json();
        const advice = typeof payload?.advice === "string" && payload.advice.trim()
          ? payload.advice.trim()
          : "Upload received. I can help you review tone, clarity, and next-step wording. Tell me what outcome you want from this conversation.";

        const custom = buildCustomConversation(query, selectedFiles);
        if (query) {
          custom.messages.push({ role: "user", text: query });
        }
        custom.messages.push({ role: "system", text: advice });
        setCustomConversation(custom);
        setConvIndex(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown network error";
        const fallback = buildCustomConversation(query, selectedFiles);
        if (query) fallback.messages.push({ role: "user", text: query });
        fallback.messages.push({
          role: "system",
          text:
            "I couldn't reach the review model right now. " +
            `(${message}) ` +
            "Your upload is saved. Try again in a moment, or share what outcome you want and I'll draft a response template.",
        });
        setCustomConversation(fallback);
        setConvIndex(0);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const query = text.trim().toLowerCase();
    if (query.includes("linkedin")) {
      setCustomConversation(null);
      setConvIndex(0);
      return;
    }
    if (query.includes("interview") || query.includes("follow-up") || query.includes("recruiter") || query.includes("email")) {
      setCustomConversation(null);
      setConvIndex(1);
      return;
    }
    setCustomConversation(null);
    setConvIndex(2);
  };

  const handleTodoGenerated = (todoText: string) => {
    if (typeof window === "undefined") return;
    const key = "uply.review.todos";
    const existingRaw = window.localStorage.getItem(key);
    const existing = existingRaw ? (JSON.parse(existingRaw) as string[]) : [];
    const cleaned = todoText.trim();
    if (!cleaned) return;
    const normalizedExisting = Array.isArray(existing)
      ? existing.map((item) => String(item).trim()).filter(Boolean)
      : [];
    const next = [cleaned, ...normalizedExisting.filter((item) => item !== cleaned)].slice(0, 12);
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("uply:todos-updated", { detail: next }));
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#f0ede8",
        overflowY: "auto",
        scrollbarWidth: "none",
      } as React.CSSProperties}
    >
      {!showHistory && <HistoryButton onClick={() => setShowHistory(true)} />}
      {showHistory && convIndex === null && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onOpenConversation={(idx) => setConvIndex(idx)}
        />
      )}
      {convIndex !== null && (
        <ConversationScreen
          index={convIndex}
          customConversation={customConversation}
          onTodoGenerated={handleTodoGenerated}
          onBack={() => {
            setConvIndex(null);
            setCustomConversation(null);
          }}
        />
      )}
      {/* ── Hero: studio illustration, deeper purple mood + bottom gradient ── */}
      <div style={{
        height: "34%",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}>
        <img
          src={bg55}
          alt=""
          aria-hidden
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            display: "block",
          }}
        />
        {/* Top purple gradient — mid depth, unified with Profile hero */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "78%",
          background: "linear-gradient(180deg, #5b52cc 0%, rgba(91,82,204,0.92) 30%, rgba(124,115,230,0.55) 65%, rgba(124,115,230,0.22) 88%, rgba(107,99,212,0) 100%)",
          pointerEvents: "none",
        }} />
        {/* Bottom atmosphere — cinematic depth */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(40,30,110,0) 50%, rgba(40,30,110,0.22) 100%)",
          pointerEvents: "none",
        }} />
        {/* Bottom gradient fade into page bg, for smooth hand-off */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 56,
          background: "linear-gradient(to bottom, rgba(240,237,232,0) 0%, #f0ede8 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Input card: thick purple frame, taller body, yellow submit ── */}
      <div style={{ margin: "0 16px", marginTop: -155, position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div style={{
          borderRadius: 32,
          background: BRAND_PURPLE,
          padding: "14px 14px 4px",
          boxShadow: "0 10px 32px rgba(60,40,180,0.30)",
        }}>
          {/* Inner white area — slightly lighter, still spacious */}
          <div style={{
            borderRadius: 22,
            background: "white",
            padding: "16px 16px 12px",
            display: "flex",
            flexDirection: "column",
            minHeight: 174,
          }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Describe your scenario or conversation."
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "#1a1830",
                background: "transparent",
                lineHeight: 1.6,
                minHeight: 128,
              }}
            />
            {/* Helper buttons row — left + right (icons unchanged size) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
              <button
                onClick={() => openFilePicker("image/*,.pdf")}
                style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#eeecf8", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Plus size={14} color={BRAND_PURPLE} strokeWidth={2} />
              </button>
              <button
                onClick={() => openFilePicker("audio/*")}
                style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#eeecf8", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Mic size={14} color={BRAND_PURPLE} strokeWidth={2} />
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {selectedFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    style={{
                      borderRadius: 10,
                      background: "#f7f5fc",
                      border: "1px solid #e2def2",
                      padding: "8px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1a1830",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#9896b8", marginTop: 1 }}>
                        {`${file.type.startsWith("audio/") ? "Audio" : "File"} · ${formatFileSize(file.size)}`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const id = `${file.name}-${file.size}-${file.lastModified}`;
                        setSelectedFiles((prev) => prev.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== id));
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#8f8aa8",
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination dots — three dots on each side, sits in the purple frame */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 18px 12px",
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Yellow submit (arrow up) — floats centered, straddles bottom edge */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          style={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: 54, height: 54, borderRadius: "50%",
          background: canSubmit && !submitting ? "#FFCF4A" : "#f2e7bd",
          border: "3px solid #f0ede8",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: canSubmit && !submitting ? "pointer" : "default",
          boxShadow: canSubmit && !submitting
            ? "0 6px 18px rgba(255,180,0,0.45), 0 2px 4px rgba(60,40,180,0.18)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
        >
          <ArrowUp size={22} color={canSubmit && !submitting ? "white" : "#e0c783"} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Performance Review — compact section label, fills card width-ish ── */}
      <div style={{
        margin: "28px 24px 18px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <div style={{ flex: "0 0 48px", height: 6, borderRadius: 999, background: "#9B94E6" }} />
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "15px",
          color: "#8F8ADF", whiteSpace: "nowrap", letterSpacing: "1.5px", lineHeight: 1,
        }}>Performance Review</div>
        <div style={{ flex: "0 0 48px", height: 6, borderRadius: 999, background: "#9B94E6" }} />
      </div>

      {/* ── Empty scene cards grid (future content) ── */}
      <div style={{ padding: "0 16px", minHeight: 120, flexShrink: 0 }} />

      {/* ── Megaphone module — yellow rounded bubble with megaphone head on right ── */}
      <div style={{
        marginTop: "auto",
        padding: "24px 16px 130px",
        flexShrink: 0,
        pointerEvents: "none",
        transform: "translateY(-23px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Yellow bubble — matches home page Luna bubble */}
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
            {/* Tail pointing right toward megaphone */}
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
          {/* Megaphone head — same size as home avatar */}
          <img
            src={megaphone}
            alt=""
            aria-hidden
            style={{ width: 76, height: 76, objectFit: "contain", flexShrink: 0, display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
