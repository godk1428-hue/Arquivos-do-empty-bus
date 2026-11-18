import { createContext, useContext, useEffect } from 'react';
import useArmazenamentoLocal from '../ganchos/useArmazenamentoLocal';

const CtxAjustes = createContext(null);
export const useAjustes = () => useContext(CtxAjustes);

/** Modo escuro e permissão de localização (persistidos no navegador). */
export function ProvedorAjustes({ children }) {
  const [dark, setDark] = useArmazenamentoLocal('painel:tema-escuro', false);
  const [locationOn, setLocationOn] = useArmazenamentoLocal('painel:localizacao-ativa', true);

  useEffect(() => {
    document.documentElement.dataset.tema = dark ? 'escuro' : 'claro';
  }, [dark]);

  return (
    <CtxAjustes.Provider value={{ dark, setDark, locationOn, setLocationOn }}>
      {children}
    </CtxAjustes.Provider>
  );
}
