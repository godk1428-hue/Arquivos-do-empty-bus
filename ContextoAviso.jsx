import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const CtxAviso = createContext(() => {});
export const useAviso = () => useContext(CtxAviso);

export function ProvedorAviso({ children }) {
  const [message, setMessage] = useState('');
  const timer = useRef();

  const toast = useCallback((msg, ms = 2800) => {
    setMessage(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), ms);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <CtxAviso.Provider value={toast}>
      {children}
      {message && <div className="toast" role="status">{message}</div>}
    </CtxAviso.Provider>
  );
}
