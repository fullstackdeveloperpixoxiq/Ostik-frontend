import { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { formatResetDate, usageTone } from "./chatUsageUtils";

/*
  Circular AI-chat usage indicator for the chatbot header.
  - Compact ring button (shows % used) that opens a small details panel.
  - Colours: Ostik primary green < 80%, amber >= 80%, red >= 95%.
  All numbers come from the backend; nothing here is trusted for enforcement.
*/

const Ring = ({ percentage, size, stroke, trackColor, color, children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percentage || 0));

  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.22,1,.36,1), stroke 300ms ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </span>
  );
};

const ChatUsageIndicator = ({ usage, status, onRetry }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close the details panel on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const unlimited = usage && usage.messageLimit === null;
  const pct = usage && !unlimited ? usage.usagePercentage : 0;
  const tone = usageTone(pct);
  const reset = formatResetDate(usage?.periodEnd);

  let ringLabel;
  if (!usage && status === "loading") ringLabel = <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />;
  else if (!usage) ringLabel = <AlertCircle size={13} className="text-white/70" />;
  else if (unlimited) ringLabel = <span className="text-[13px] font-semibold leading-none">∞</span>;
  else ringLabel = <span className="text-[9px] font-bold leading-none tabular-nums">{Math.round(pct)}%</span>;

  const ariaLabel = usage
    ? unlimited
      ? "AI chat usage: unlimited"
      : `AI chat usage: ${usage.messagesUsed} of ${usage.messageLimit} messages used this month`
    : "AI chat usage";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-expanded={open}
        title="Monthly AI chat usage"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Ring percentage={pct} size={30} stroke={3} trackColor="rgba(255,255,255,0.18)" color={usage ? tone.stroke : "rgba(255,255,255,0.3)"}>
          {ringLabel}
        </Ring>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="AI chat usage details"
          className="ostik-chat-message absolute right-0 top-11 z-10 w-[min(272px,calc(100vw-32px))] rounded-2xl border border-[#e8ede3] bg-white p-4 text-[#171717] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
        >
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#777777]">Monthly AI chat usage</p>

          {!usage && status === "loading" && <p className="mt-3 text-[13px] text-[#555555]">Loading your usage…</p>}

          {!usage && status !== "loading" && (
            <div className="mt-3 space-y-2">
              <p className="text-[13px] text-[#555555]">Couldn't load your usage right now.</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e3e3e3] px-3 py-1 text-[12px] font-medium hover:border-black"
                >
                  <RefreshCcw size={12} /> Retry
                </button>
              )}
            </div>
          )}

          {usage && unlimited && (
            <div className="mt-3 space-y-1 text-[13px] text-[#555555]">
              <p className="text-[15px] font-semibold text-[#171717]">Unlimited messages</p>
              <p>{usage.messagesUsed} message{usage.messagesUsed === 1 ? "" : "s"} sent this month.</p>
            </div>
          )}

          {usage && !unlimited && (
            <div className="mt-3 flex items-center gap-4">
              <Ring percentage={pct} size={76} stroke={7} trackColor="#eef1ea" color={tone.stroke}>
                <span className="text-center">
                  <span className={`block text-[17px] font-bold leading-none tabular-nums ${tone.text}`}>{Math.round(pct)}%</span>
                  <span className="mt-0.5 block text-[10px] text-[#777777]">used</span>
                </span>
              </Ring>

              <dl className="min-w-0 flex-1 space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#777777]">Used</dt>
                  <dd className="font-semibold tabular-nums">
                    {usage.messagesUsed} / {usage.messageLimit}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#777777]">Remaining</dt>
                  <dd className={`font-semibold tabular-nums ${tone.text}`}>{usage.messagesRemaining}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#777777]">Resets</dt>
                  <dd className="font-medium">{reset}</dd>
                </div>
              </dl>
            </div>
          )}

          {usage && !unlimited && (
            <p className={`mt-3 rounded-lg px-2.5 py-1.5 text-[12px] ${tone.soft} ${tone.text}`}>
              {usage.isLimitReached
                ? `Monthly allowance used up. Resets on ${reset}.`
                : pct >= 80
                  ? `Only ${usage.messagesRemaining} message${usage.messagesRemaining === 1 ? "" : "s"} left this month.`
                  : "Each question you ask the assistant uses one message."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatUsageIndicator;
