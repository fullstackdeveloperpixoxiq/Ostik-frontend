import { useCallback, useEffect, useState } from "react";
import { cachedGet, peekCached } from "./apiCache";

// Fetch a GET endpoint for a section of the page.
//
// - Renders instantly from the last response when one exists (returning to
//   the homepage no longer shows skeletons), while a fresh request runs in
//   the background and replaces it. Use ttl only for near-static data.
// - Concurrent identical requests are shared.
// - `retry()` re-runs the request after a failure.
const useCachedGet = (path, { params, ttl = 0 } = {}) => {
  const paramsKey = JSON.stringify(params || null);

  const [state, setState] = useState(() => {
    const cached = peekCached(path, { params });
    return { data: cached?.data, error: null, loading: !cached };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const requestParams = JSON.parse(paramsKey) || undefined;

    cachedGet(path, { params: requestParams, ttl })
      .then((response) => {
        if (active) setState({ data: response.data, error: null, loading: false });
      })
      .catch((error) => {
        console.error(`Request failed: ${path}`, error);
        // Keep any data already on screen; only surface the error.
        if (active) setState((prev) => ({ ...prev, error, loading: false }));
      });

    return () => {
      active = false;
    };
  }, [path, paramsKey, ttl, attempt]);

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, loading: !prev.data }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
};

export default useCachedGet;
