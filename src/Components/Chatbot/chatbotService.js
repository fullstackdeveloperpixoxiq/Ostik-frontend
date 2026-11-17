import axios from "axios";

/*
  API + session helpers for the Ostik customer chatbot.

  - Uses the existing VITE_API_URL and the existing JWT in localStorage("token").
  - The Gemini key lives only on the backend; nothing AI-related is configured here.
  - Guest conversations are protected by a random guest token issued by the
    backend. It is kept in localStorage only to restore the chat after a page
    reload; the server remains the source of truth for ownership.
*/

const API_URL = `${import.meta.env.VITE_API_URL}/api/chatbot`;
const SESSION_KEY = "ostik_chat_session";
const REQUEST_TIMEOUT_MS = 70000;

const authHeaders = (guestToken) => {
  const headers = {};
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (guestToken) {
    headers["X-Chat-Guest-Token"] = guestToken;
  }

  return headers;
};

// Who the current chat belongs to: a logged-in customer, or this browser as a guest.
export const getCurrentOwner = () => {
  if (!localStorage.getItem("token")) return "guest";

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return `user:${user?._id || user?.id || "me"}`;
  } catch {
    return "user:me";
  }
};

export const loadSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!session || session.owner !== getCurrentOwner()) return null;
    return session;
  } catch {
    return null;
  }
};

export const saveSession = (session) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, owner: getCurrentOwner() }));
  } catch {
    // storage unavailable (private mode) - chat still works for this page view
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
};

export const sendChatMessage = async ({ message, conversationId, guestToken, signal }) => {
  const response = await axios.post(
    `${API_URL}/message`,
    { message, ...(conversationId ? { conversationId } : {}) },
    { headers: authHeaders(guestToken), timeout: REQUEST_TIMEOUT_MS, signal }
  );

  return response.data;
};

export const fetchConversation = async ({ conversationId, guestToken, signal }) => {
  const response = await axios.get(`${API_URL}/conversations/${conversationId}`, {
    headers: authHeaders(guestToken),
    timeout: 20000,
    signal,
  });

  return response.data;
};

// Map API / network errors to a short customer-friendly message.
export const describeError = (error) => {
  if (axios.isCancel?.(error) || error?.code === "ERR_CANCELED") return null;

  const data = error?.response?.data;

  if (error?.code === "ECONNABORTED") {
    return { code: "TIMEOUT", message: "The assistant is taking too long to respond. Please try again." };
  }

  if (!error?.response) {
    return { code: "NETWORK", message: "Couldn't reach Ostik. Please check your connection and try again." };
  }

  return {
    code: data?.code || `HTTP_${error.response.status}`,
    message: data?.message || "Something went wrong. Please try again.",
  };
};
