import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronUp,
  Minus,
  Package,
  RefreshCcw,
  MessageCircleQuestion,
  RotateCcw,
  SendHorizontal,
  ShoppingBag,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import ChatbotMessage from "./ChatbotMessage";
import ChatUsageIndicator from "./ChatUsageIndicator";
import { formatResetDate } from "./chatUsageUtils";
import {
  clearSession,
  DEFAULT_CONFIG,
  fetchConfig,
  describeError,
  fetchConversation,
  fetchUsage,
  getCurrentOwner,
  loadSession,
  saveSession,
  sendChatMessage,
} from "./chatbotService";
import "./Chatbot.css";


// Authentication screens where the floating assistant would get in the way.
const HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/forgot-password-otp",
  "/reset-password",
];

// Icons cycle through the admin-configured suggested questions.
const SUGGESTION_ICONS = [ShoppingBag, Tag, Package, RefreshCcw, MessageCircleQuestion, Sparkles];

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
  const [config, setConfig] = useState(DEFAULT_CONFIG); // Admin -> Chatbot Settings
  const [usage, setUsage] = useState(null); // monthly AI chat usage (logged-in customers)
  const [usageStatus, setUsageStatus] = useState("idle"); // idle | loading | error

  const sessionRef = useRef(null); // { conversationId, guestToken }
  const ownerRef = useRef(getCurrentOwner());
  const restoredRef = useRef(false);
  const sendingRef = useRef(false); // guards against duplicate submits
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const visibleRef = useRef(false);
  const restoreAbortRef = useRef(null);
  const usageAbortRef = useRef(null);

  const isHidden = HIDDEN_ROUTES.includes(location.pathname.toLowerCase()) || !config.enabled;
  const MAX_LENGTH = config.maxMessageLength || DEFAULT_CONFIG.maxMessageLength;
  const assistantName = config.assistantName || DEFAULT_CONFIG.assistantName;

  // Load the admin-configured name, welcome text and suggestions (defaults on failure).
  useEffect(() => {
    const controller = new AbortController();
    fetchConfig({ signal: controller.signal })
      .then(setConfig)
      .catch(() => {}); // keep defaults
    return () => controller.abort();
  }, []);
  const isVisible = isOpen && !isMinimized;

  useEffect(() => {
    visibleRef.current = isVisible;
  }, [isVisible]);

  // ---------------------------------------------------------------------
  // Monthly usage (only for logged-in customers)
  // ---------------------------------------------------------------------
  const loadUsage = useCallback(() => {
    usageAbortRef.current?.abort();

    if (!localStorage.getItem("token")) {
      setUsage(null);
      setUsageStatus("idle");
      return;
    }

    const controller = new AbortController();
    usageAbortRef.current = controller;
    setUsageStatus("loading");

    fetchUsage({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setUsage(data);
        setUsageStatus(data ? "idle" : "error");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setUsageStatus("error"); // keep the last known usage, if any
      });
  }, []);

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
      usageAbortRef.current?.abort();
      setUsage(null);
      setUsageStatus("idle");
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
      usageAbortRef.current?.abort();
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

          if (data.usage) setUsage(data.usage);
          else if (localStorage.getItem("token")) loadUsage();

          if (!visibleRef.current) setHasUnread(true);
        } catch (error) {
          const info = describeError(error);
          if (!info) return; // request was cancelled

          // Monthly allowance exhausted: show the limit banner instead of an error bubble,
          // and give the unsent question back to the input box.
          if (info.code === "USAGE_LIMIT_REACHED") {
            if (info.usage) setUsage(info.usage);
            else loadUsage();
            if (!isRetry) {
              setMessages((current) => {
                const last = current[current.length - 1];
                return last?.role === "user" && last.content === text ? current.slice(0, -1) : current;
              });
            }
            setInput((current) => current || text);
            return;
          }

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
    [loadUsage, MAX_LENGTH]
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
    loadUsage();
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  // On phones the chat covers the page, so get out of the way after following a link.
  const handleNavigate = () => {
    if (isMobileViewport()) setIsMinimized(true);
  };

  if (isHidden) return null;

  const limitReached = !!usage?.isLimitReached;
  const resetDate = formatResetDate(usage?.periodEnd);

  const lastError = messages.length && messages[messages.length - 1].role === "error" ? messages[messages.length - 1] : null;

  return (
    <div className="ostik-chatbot">
      {/* ================= LAUNCHER ================= */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label={`Open ${assistantName}`}
          className="ostik-chat-launcher fixed bottom-[68px] right-4 z-[90] flex h-14 items-center gap-2 rounded-full bg-black pl-4 pr-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03] sm:bottom-[84px] sm:right-6 sm:pr-5"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />
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
          aria-label={`Expand ${assistantName}`}
          className="fixed bottom-[68px] right-4 z-[90] flex items-center gap-2.5 rounded-full bg-black py-2 pl-2 pr-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:bottom-[84px] sm:right-6"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />
            {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-black bg-[#ff3b30]" />}
          </span>
          <span className="text-[13px] font-semibold">{loading ? "Assistant is typing…" : assistantName}</span>
          <ChevronUp size={16} />
        </button>
      )}

      {/* ================= CHAT WINDOW ================= */}
      {isVisible && (
        <section
          role="dialog"
          aria-label={assistantName}
          className="ostik-chat-window fixed inset-0 z-[400] flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-[84px] sm:right-6 sm:z-[150] sm:h-[min(640px,calc(100dvh-108px))] sm:w-[390px] sm:rounded-3xl sm:border sm:border-[#e8ede3] sm:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        >
          {/* Header */}
          <header className="flex items-center gap-3 bg-black px-4 py-3 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
              <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-tight">{assistantName}</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/70">
                <span className="ostik-chat-online h-2 w-2 rounded-full bg-[#00ff03]" />
                Online · Shopping help
              </p>
            </div>

            {(usage || usageStatus !== "idle") && (
              <ChatUsageIndicator usage={usage} status={usageStatus} onRetry={loadUsage} />
            )}

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
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[#e8ede3]">
                <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />
              </span>
              <div className="max-w-[88%] space-y-2 rounded-2xl rounded-tl-md bg-[#F8F9F6] px-3.5 py-2.5 text-[14px] leading-relaxed text-[#333333]">
                {(config.welcomeMessage || DEFAULT_CONFIG.welcomeMessage)
                  .split(/\n\s*\n/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className={i === 0 ? "whitespace-pre-line font-semibold text-[#171717]" : "whitespace-pre-line"}>
                      {para}
                    </p>
                  ))}
              </div>
            </div>

            {!messages.length && !restoring && (
              <div className="flex flex-wrap gap-2 pl-9">
                {(config.suggestedQuestions || []).map((label, i) => {
                  const Icon = SUGGESTION_ICONS[i % SUGGESTION_ICONS.length];
                  return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(label)}
                    disabled={loading || limitReached}
                    className="flex items-center gap-1.5 rounded-full border border-[#d9e8c8] bg-[#f7fbf3] px-3 py-1.5 text-[13px] font-medium text-[#171717] transition-colors hover:border-[#00e603] hover:bg-[#f0f8e7] disabled:opacity-50"
                  >
                    <Icon size={14} className="text-[#2f9e00]" />
                    {label}
                  </button>
                  );
                })}
              </div>
            )}

            {restoring && (
              <p className="text-center text-[12px] text-[#999999]">Loading your conversation…</p>
            )}

            {messages.map((message) => (
              <ChatbotMessage key={message.id} message={message} onNavigate={handleNavigate} />
            ))}

            {lastError?.retryText && !loading && !limitReached && (
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[#e8ede3]">
                  <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />
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
            {limitReached && (
              <div role="status" className="mb-2.5 rounded-2xl border border-[#f7c6c2] bg-[#fdecea] px-3.5 py-2.5 text-[13px] leading-snug text-[#8a1c14]">
                <p className="font-semibold">You've used all your AI chat messages for this month.</p>
                <p className="mt-0.5 text-[12px] text-[#a8362d]">
                  Your allowance resets on {resetDate}. You can still browse products, view orders and read this conversation.
                </p>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-3xl border border-[#e3e3e3] bg-white py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-black">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_LENGTH}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={limitReached}
                placeholder={limitReached ? `Messages available again on ${resetDate}` : "Ask about products, offers or orders…"}
                aria-label="Type your message"
                className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[14px] text-[#171717] outline-none placeholder:text-[#999999] disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || limitReached || !input.trim()}
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
