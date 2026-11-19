import { Link } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import ProductRecommendation from "./ProductRecommendation";

/*
  Minimal, SAFE markdown renderer for assistant replies.
  - Builds React elements only (no dangerouslySetInnerHTML), so model output
    can never inject HTML or scripts.
  - Supports **bold**, `code`, bullet / numbered lists and [text](/path) links.
  - Only internal Ostik paths ("/...") become links. Anything else (external
    URLs, javascript: etc.) is rendered as plain text.
*/

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

const isInternalPath = (href) => /^\/(?!\/)[^\s]*$/.test(href);

const renderInline = (text, keyPrefix, onNavigate) =>
  text.split(INLINE_PATTERN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;

    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-[#171717]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-[#f0f8e7] px-1 py-0.5 font-mono text-[12px] text-[#171717]">
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;

      if (isInternalPath(href)) {
        return (
          <Link
            key={key}
            to={href}
            onClick={onNavigate}
            className="font-semibold text-[#171717] underline decoration-[#00e603] decoration-2 underline-offset-2 hover:text-[#2f9e00]"
          >
            {label}
          </Link>
        );
      }

      return <span key={key}>{label}</span>;
    }

    return part;
  });

const renderMarkdown = (content, onNavigate) => {
  const lines = content.split("\n");
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (!list) return;
    const ListTag = list.ordered ? "ol" : "ul";
    blocks.push(
      <ListTag
        key={`list-${blocks.length}`}
        className={`my-1 space-y-1 pl-4 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-[#2f9e00]`}
      >
        {list.items.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`, onNavigate)}</li>
        ))}
      </ListTag>
    );
    list = null;
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (bullet || numbered) {
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      return;
    }

    flushList();

    if (!line) return;

    // Headings are not expected, but render them as bold text if they appear.
    const heading = line.match(/^#{1,6}\s+(.*)$/);

    blocks.push(
      <p key={`p-${index}`} className={heading ? "font-semibold text-[#171717]" : ""}>
        {renderInline(heading ? heading[1] : line, `p-${index}`, onNavigate)}
      </p>
    );
  });

  flushList();
  return blocks;
};

const ChatbotMessage = ({ message, onNavigate }) => {
  if (message.role === "user") {
    return (
      <div className="ostik-chat-message flex justify-end">
        <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-black px-3.5 py-2.5 text-[14px] leading-relaxed text-white">
          {message.content}
        </div>
      </div>
    );
  }

  const isError = message.role === "error";

  return (
    <div className="ostik-chat-message flex items-start gap-2">
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isError ? "bg-[#fdecea] text-[#d93025]" : "bg-white border border-[#e8ede3]"
        }`}
        aria-hidden="true"
      >
        {isError ? <Sparkles size={14} /> : <img src="/ostikFavicon.png" alt="Ostik" className="h-[70%] w-[70%] object-contain" />}
      </span>

      <div className="min-w-0 max-w-[88%] flex-1">
        <div
          className={`break-words rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[14px] leading-relaxed ${
            isError
              ? "border border-[#f5c6c2] bg-[#fdf3f2] text-[#a52a1f]"
              : "bg-[#F8F9F6] text-[#333333]"
          } space-y-1.5`}
        >
          {isError ? <p>{message.content}</p> : renderMarkdown(message.content, onNavigate)}
        </div>

        {message.requiresLogin && !localStorage.getItem("token") && (
          <Link
            to="/login"
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#00ff03] px-4 py-1.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#00e603]"
          >
            <LogIn size={14} /> Log in to continue
          </Link>
        )}

        {message.products?.length > 0 && (
          <ProductRecommendation products={message.products} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
};

export default ChatbotMessage;
