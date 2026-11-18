import { useEffect, useState } from 'react';

/** useState que persiste em localStorage (com try/catch). */
export default function useArmazenamentoLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* segue sem persistir */ }
  }, [key, value]);
  return [value, setValue];
}
