import { useEffect, useState, useCallback } from "react";

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = [],
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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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
  }, [execute, ...deps]);

  return { loading, error, data, execute };
}
