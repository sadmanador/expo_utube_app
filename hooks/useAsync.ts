import { DependencyList, useCallback, useEffect, useState } from "react";

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList = [],
  autoRun = true // whether to run automatically on mount / deps change
) {
  const [loading, setLoading] = useState(autoRun);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (autoRun) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, ...deps]);

  return { loading, error, data, execute };
}
