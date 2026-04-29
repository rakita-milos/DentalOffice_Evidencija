import { useCallback, useEffect, useRef, useState } from 'react';

export function useApiData(loader, initialValue) {
  const loaderRef = useRef(loader);
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setData(await loaderRef.current());
    } catch (e) {
      setError(e.message || 'Unknown API error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, setData, loading, error, refresh };
}
