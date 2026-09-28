import { useState, useCallback } from 'react';

export function usePagination(initialLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const reset = useCallback(() => setPage(1), []);

  return { page, limit, setPage, reset };
}
