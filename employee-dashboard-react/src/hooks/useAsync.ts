import { useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Runs `fn` whenever `deps` changes, tracking loading/error/data — avoids repeating that boilerplate in every view. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
