import axios from "axios";

// =========================================================
// Lightweight GET cache / request de-duplication
// ---------------------------------------------------------
// - Identical concurrent GETs share one network request (e.g. the homepage
//   sections that each needed the wishlist, or Navbar + Categories both
//   needing /api/category).
// - `ttl` (ms) keeps a successful response for reuse. Use it ONLY for
//   near-static data (categories, banners, site settings). Prices and stock
//   must use ttl: 0 so they are always fetched fresh.
// - `peekCached` returns the last response even if expired, so a page can
//   paint instantly with previous data while a fresh request runs
//   (stale-while-revalidate). The fresh response always replaces it.
// - Errors are never cached.
// =========================================================

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_TIMEOUT = 20000;

const store = new Map(); // key -> { response, expires }
const inflight = new Map(); // key -> Promise<response>

const buildKey = (path, params, token) =>
  `${path}?${params ? JSON.stringify(params) : ""}#${token || ""}`;

const toUrl = (path) => (path.startsWith("http") ? path : `${API_URL}${path}`);

export const cachedGet = (path, { params, token, ttl = 0 } = {}) => {
  const key = buildKey(path, params, token);
  const now = Date.now();
  const hit = store.get(key);

  if (hit && hit.expires > now) {
    return Promise.resolve(hit.response);
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const request = axios
    .get(toUrl(path), {
      params,
      timeout: DEFAULT_TIMEOUT,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    .then((response) => {
      // Keep only what callers read, so cached entries stay small.
      const slim = { data: response.data, status: response.status };
      store.set(key, { response: slim, expires: Date.now() + ttl });
      return slim;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
};

// Last known response (fresh or stale), or undefined.
export const peekCached = (path, { params, token } = {}) =>
  store.get(buildKey(path, params, token))?.response;

// Find a product (with its active variants) in any product-list response
// already loaded this session, so the product page can paint immediately
// while it fetches fresh details. Returns undefined if not found.
export const findCachedProduct = (productId) => {
  for (const [key, entry] of store) {
    if (!key.startsWith("/api/product?") && !key.startsWith("/api/product/hot-selling?")) {
      continue;
    }

    const match = entry.response?.data?.products?.find(
      (product) => product?._id === productId && Array.isArray(product.variants)
    );

    if (match) return match;
  }

  return undefined;
};

// Drop cached entries whose path starts with `prefix`.
export const invalidateCache = (prefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
};

// =========================================================
// Shared wishlist ids
// ---------------------------------------------------------
// Several components on one page need "which product ids are wishlisted".
// They share one request; a short TTL covers a single page render, and any
// add/remove invalidates it so the next page sees fresh data.
// =========================================================

const WISHLIST_PATH = "/api/wishlist";

export const fetchWishlistIds = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const response = await cachedGet(WISHLIST_PATH, { token, ttl: 10000 });
  const products = response.data?.wishlist?.products || [];

  return products
    .map((product) =>
      typeof product === "string" ? product : product?._id
    )
    .filter(Boolean);
};

export const invalidateWishlist = () => invalidateCache(WISHLIST_PATH);

// Any successful add/remove anywhere in the app invalidates the shared
// wishlist entry, without having to touch every call site.
axios.interceptors.response.use((response) => {
  const method = response.config?.method;
  const url = response.config?.url || "";

  if (method && method !== "get" && url.includes(WISHLIST_PATH)) {
    invalidateWishlist();
  }

  return response;
});

// Cache lifetimes for near-static content.
export const STATIC_TTL = 5 * 60 * 1000;
