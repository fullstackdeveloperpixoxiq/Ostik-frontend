import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronUp,
  Minus,
  Package,
  RefreshCcw,
  RotateCcw,
  SendHorizontal,
  ShoppingBag,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import ChatbotMessage from "./ChatbotMessage";
import {
  clearSession,
  describeError,
  fetchConversation,
  getCurrentOwner,
  loadSession,
  saveSession,
  sendChatMessage,
} from "./chatbotService";
import "./Chatbot.css";

const MAX_LENGTH = 1000;

// Authentication screens where the floating assistant would get in the way.
const HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/forgot-password-otp",
  "/reset-password",
];

const SUGGESTIONS = [
  { label: "Explore products", prompt: "What products do you have?", icon: ShoppingBag },
  { label: "Find offers", prompt: "Do you have any offers or discounted products right now?", icon: Tag },
  { label: "Track my order", prompt: "Where is my latest order?", icon: Package },
  { label: "Return or exchange help", prompt: "How can I return or exchange a product?", icon: RefreshCcw },
];

let localId = 0;
const nextId = () => `local-${Date.now()}-${(localId += 1)}`;

const isMobileViewport = () => window.matchMedia?.("(max-width: 639px)").matches;

const Chatbot = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const sessionRef = useRef(null); // { conversationId, guestToken }
  const ownerRef = useRef(getCurrentOwner());
  const restoredRef = useRef(false);
  const sendingRef = useRef(false); // guards against duplicate submits
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const visibleRef = useRef(false);
  const restoreAbortRef = useRef(null);

  const isHidden = HIDDEN_ROUTES.includes(location.pathname.toLowerCase());
  const isVisible = isOpen && !isMinimized;

  useEffect(() => {
    visibleRef.current = isVisible;
  }, [isVisible]);

  // ---------------------------------------------------------------------
  // Reset the chat when the customer logs in / out (conversations belong
  // to either a customer account or a guest browser, never both).
  // ---------------------------------------------------------------------
  const resetConversation = useCallback(() => {
    abortRef.current?.abort();
    restoreAbortRef.current?.abort();
    setRestoring(false);
    sessionRef.current = null;
    restoredRef.current = true;
    sendingRef.current = false;
    clearSession();
    setMessages([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const owner = getCurrentOwner();
    if (owner !== ownerRef.current) {
      ownerRef.current = owner;
      abortRef.current?.abort();
      restoreAbortRef.current?.abort();
      sessionRef.current = null;
      restoredRef.current = false;
      sendingRef.current = false;
      setMessages([]);
      setLoading(false);
      setRestoring(false);
    }
  }, [location.pathname]);

  // ---------------------------------------------------------------------
  // Restore a previous conversation (e.g. after a full page reload)
  // ---------------------------------------------------------------------
  // Runs from the open handler (not an effect) the first time the chat opens.
  const restoreConversation = () => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const session = loadSession();
    if (!session?.conversationId) return;

    sessionRef.current = { conversationId: session.conversationId, guestToken: session.guestToken };

    const controller = new AbortController();
    restoreAbortRef.current = controller;
    setRestoring(true);

    fetchConversation({ ...sessionRef.current, signal: controller.signal })
      .then((data) => {
        setMessages((current) => (current.length ? current : data.messages || []));
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        const status = error?.response?.status;
        if (status === 404 || status === 401) {
          sessionRef.current = null;
          clearSession();
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setRestoring(false);
      });
  };

  // Abort any pending request when the component unmounts
  useEffect(
    () => () => {
      abortRef.current?.abort();
      restoreAbortRef.current?.abort();
    },
    []
  );

  // Auto-scroll to the newest message
  useEffect(() => {
    if (!isVisible) return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, isVisible]);

  // Focus the input when the window opens (desktop only, avoids popping the mobile keyboard)
  useEffect(() => {
    if (isVisible && !isMobileViewport()) inputRef.current?.focus();
  }, [isVisible]);

  // Close with Escape
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible]);

  // Auto-grow textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  // ---------------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------------
  const send = useCallback(
    async (rawText, { isRetry = false } = {}) => {
      const text = (rawText || "").trim();
      if (!text || sendingRef.current) return;

      if (text.length > MAX_LENGTH) return;

      sendingRef.current = true;
      setLoading(true);
      setInput("");

      setMessages((current) => {
        // When retrying, drop the previous error bubble instead of duplicating the question
        const base = isRetry ? current.filter((m) => m.role !== "error") : current;
        return isRetry ? base : [...base, { id: nextId(), role: "user", content: text }];
      });

      const controller = new AbortController();
      abortRef.current = controller;

      const attempt = async (allowReset) => {
        try {
          const data = await sendChatMessage({
            message: text,
            conversationId: sessionRef.current?.conversationId,
            guestToken: sessionRef.current?.guestToken,
            signal: controller.signal,
          });

          sessionRef.current = {
            conversationId: data.conversationId,
            guestToken: data.guestToken || sessionRef.current?.guestToken || null,
          };
          saveSession(sessionRef.current);

          setMessages((current) => [
            ...current,
            {
              id: data.message?.id || nextId(),
              role: "assistant",
              content: data.reply,
              products: data.products || [],
              requiresLogin: !!data.requiresLogin,
            },
          ]);

          if (!visibleRef.current) setHasUnread(true);
        } catch (error) {
          const info = describeError(error);
          if (!info) return; // request was cancelled

          // Stale / foreign conversation: start a fresh one and resend once.
          if (info.code === "CONVERSATION_NOT_FOUND" && allowReset) {
            sessionRef.current = null;
            clearSession();
            return attempt(false);
          }

          // Expired / invalid login: follow the site's existing behaviour.
          if (info.code === "AUTH_EXPIRED" || info.code === "AUTH_INVALID") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            ownerRef.current = getCurrentOwner();
            sessionRef.current = null;
            clearSession();
          }

          setMessages((current) => [
            ...current,
            {
              id: nextId(),
              role: "error",
              content: info.message,
              retryText: ["AUTH_EXPIRED", "AUTH_INVALID", "MESSAGE_TOO_LONG", "INVALID_MESSAGE"].includes(info.code)
                ? null
                : text,
              requiresLogin: info.code === "AUTH_EXPIRED" || info.code === "AUTH_INVALID",
            },
          ]);
        }
      };

      await attempt(true);

      if (abortRef.current === controller) abortRef.current = null;
      sendingRef.current = false;
      setLoading(false);
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const openChat = () => {
    restoreConversation();
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  // On phones the chat covers the page, so get out of the way after following a link.
  const handleNavigate = () => {
    if (isMobileViewport()) setIsMinimized(true);
  };

  if (isHidden) return null;

  const lastError = messages.length && messages[messages.length - 1].role === "error" ? messages[messages.length - 1] : null;

  return (
    <div className="ostik-chatbot">
      {/* ================= LAUNCHER ================= */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open Ostik AI Assistant"
          className="ostik-chat-launcher fixed bottom-[68px] right-4 z-[90] flex h-14 items-center gap-2 rounded-full bg-black pl-4 pr-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03] sm:bottom-[84px] sm:right-6 sm:pr-5"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff03] text-black">
            <Sparkles size={17} />
            {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-black bg-[#ff3b30]" />}
          </span>
          <span className="hidden text-[14px] font-semibold sm:inline">Ask Ostik AI</span>
        </button>
      )}

      {/* ================= MINIMIZED BAR ================= */}
      {isOpen && isMinimized && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Expand Ostik AI Assistant"
          className="fixed bottom-[68px] right-4 z-[90] flex items-center gap-2.5 rounded-full bg-black py-2 pl-2 pr-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:bottom-[84px] sm:right-6"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff03] text-black">
            <Sparkles size={16} />
            {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-black bg-[#ff3b30]" />}
          </span>
          <span className="text-[13px] font-semibold">{loading ? "Assistant is typing…" : "Ostik AI Assistant"}</span>
          <ChevronUp size={16} />
        </button>
      )}

      {/* ================= CHAT WINDOW ================= */}
      {isVisible && (
        <section
          role="dialog"
          aria-label="Ostik AI Assistant"
          className="ostik-chat-window fixed inset-0 z-[400] flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-[84px] sm:right-6 sm:z-[150] sm:h-[min(640px,calc(100dvh-108px))] sm:w-[390px] sm:rounded-3xl sm:border sm:border-[#e8ede3] sm:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        >
          {/* Header */}
          <header className="flex items-center gap-3 bg-black px-4 py-3 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00ff03] text-black">
              <Sparkles size={19} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-tight">Ostik AI Assistant</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/70">
                <span className="ostik-chat-online h-2 w-2 rounded-full bg-[#00ff03]" />
                Online · Shopping help
              </p>
            </div>

            <button
              type="button"
              onClick={resetConversation}
              disabled={loading || !messages.length}
              title="New conversation"
              aria-label="Start a new conversation"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-[#00ff03] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/80"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Minimize"
              aria-label="Minimize chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-[#00ff03]"
            >
              <Minus size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="Close"
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-[#00ff03]"
            >
              <X size={18} />
            </button>
          </header>

          {/* Body */}
          <div
            ref={scrollRef}
            className="ostik-chat-body flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            aria-live="polite"
          >
            {/* Welcome */}
            <div className="ostik-chat-message flex items-start gap-2">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[#00ff03]">
                <Sparkles size={14} />
              </span>
              <div className="max-w-[88%] space-y-2 rounded-2xl rounded-tl-md bg-[#F8F9F6] px-3.5 py-2.5 text-[14px] leading-relaxed text-[#333333]">
                <p className="font-semibold text-[#171717]">Hi! Welcome to Ostik.</p>
                <p>
                  I&apos;m your personal shopping assistant. I can help you discover products, find great deals,
                  track your orders and answer questions about shopping with Ostik.
                </p>
                <p>How can I help you today?</p>
              </div>
            </div>

            {!messages.length && !restoring && (
              <div className="flex flex-wrap gap-2 pl-9">
                {SUGGESTIONS.map(({ label, prompt, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(prompt)}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-full border border-[#d9e8c8] bg-[#f7fbf3] px-3 py-1.5 text-[13px] font-medium text-[#171717] transition-colors hover:border-[#00e603] hover:bg-[#f0f8e7] disabled:opacity-50"
                  >
                    <Icon size={14} className="text-[#2f9e00]" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {restoring && (
              <p className="text-center text-[12px] text-[#999999]">Loading your conversation…</p>
            )}

            {messages.map((message) => (
              <ChatbotMessage key={message.id} message={message} onNavigate={handleNavigate} />
            ))}

            {lastError?.retryText && !loading && (
              <div className="pl-9">
                <button
                  type="button"
                  onClick={() => send(lastError.retryText, { isRetry: true })}
                  className="flex items-center gap-1.5 rounded-full border border-[#e3e3e3] px-3 py-1 text-[12px] font-medium text-[#333333] hover:border-black"
                >
                  <RefreshCcw size={12} /> Try again
                </button>
              </div>
            )}

            {loading && (
              <div className="ostik-chat-message flex items-center gap-2" aria-label="Assistant is typing">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[#00ff03]">
                  <Sparkles size={14} />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-[#F8F9F6] px-4 py-3">
                  <span className="ostik-chat-dot" />
                  <span className="ostik-chat-dot" />
                  <span className="ostik-chat-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <form onSubmit={handleSubmit} className="border-t border-[#eeeeee] bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
            <div className="flex items-end gap-2 rounded-3xl border border-[#e3e3e3] bg-white py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-black">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_LENGTH}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, offers or orders…"
                aria-label="Type your message"
                className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[14px] text-[#171717] outline-none placeholder:text-[#999999]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00ff03] text-black transition-colors hover:bg-[#00e603] disabled:bg-[#e9ecef] disabled:text-[#999999]"
              >
                <SendHorizontal size={17} />
              </button>
            </div>
            <div className="mt-1.5 flex justify-between px-2 text-[11px] text-[#999999]">
              <span>AI assistant · answers may need checking on the product page</span>
              {input.length > MAX_LENGTH - 200 && (
                <span>
                  {input.length}/{MAX_LENGTH}
                </span>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default Chatbot;
