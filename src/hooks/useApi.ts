import { useState, useEffect, useCallback, useRef } from "react";
import { ApiError } from "@/services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Keep a stable ref to fetcher to avoid effect re-runs when arrow functions change identity
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [trigger, setTrigger] = useState(0);

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred.";
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, trigger, ...deps]);

  const refetch = useCallback(() => setTrigger((n) => n + 1), []);

  return { ...state, refetch };
}
