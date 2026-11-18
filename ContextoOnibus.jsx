import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ONIBUS } from '../dados/onibus';
import useArmazenamentoLocal from '../ganchos/useArmazenamentoLocal';

const CtxOnibus = createContext(null);
export const useOnibus = () => useContext(CtxOnibus);

const TICK_MS = 60_000;
const countsFor = (bus, vote) => {
  const c = { ...bus.counts };
  if (vote in c) c[vote] += 1;
  return c;
};
const statusFor = (c) =>
  c.full >= c.mid && c.full >= c.empty ? 'Cheio' : c.mid >= c.empty ? 'Moderado' : 'Vazio';

/** Linhas, favoritos, relatos de lotação e contagem regressiva simulada. */
export function ProvedorOnibus({ children }) {
  const [favorites, setFavorites] = useArmazenamentoLocal('painel:linhas-favoritas', []);
  const [votes, setVotes] = useArmazenamentoLocal('painel:relatos', {});
  const [minutes, setMinutes] = useState(() => Object.fromEntries(ONIBUS.map((b) => [b.line, b.minutes])));

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes((prev) => Object.fromEntries(Object.entries(prev).map(([line, m]) => {
        const next = m - 1;
        return [line, next < 0 ? 15 + Math.floor(Math.random() * 15) : next];
      })));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const buses = useMemo(() => ONIBUS.map((b) => {
    const counts = countsFor(b, votes[b.line]);
    return { ...b, minutes: minutes[b.line], counts, status: statusFor(counts), reports: counts.empty + counts.mid + counts.full };
  }), [minutes, votes]);

  const isFavorite = (line) => favorites.includes(line);
  const toggleFavorite = (line) =>
    setFavorites((f) => (f.includes(line) ? f.filter((l) => l !== line) : [...f, line]));
  // tocar de novo no mesmo botão desfaz o voto
  const vote = (line, key) =>
    setVotes((v) => {
      const next = { ...v };
      if (next[line] === key) delete next[line]; else next[line] = key;
      return next;
    });

  return (
    <CtxOnibus.Provider value={{ buses, votes, isFavorite, toggleFavorite, vote }}>
      {children}
    </CtxOnibus.Provider>
  );
}
