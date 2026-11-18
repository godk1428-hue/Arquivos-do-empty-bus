import { createContext, useContext, useState } from 'react';
import Autenticacao from '../servicos/autenticacao';

const CtxAuth = createContext(null);
export const useAutenticacao = () => useContext(CtxAuth);

export function ProvedorAuth({ children }) {
  const [user, setUser] = useState(() => Autenticacao.currentUser());

  const login = async (data) => {
    const result = await Autenticacao.login(data);
    if (result.ok) setUser(result.user);
    return result;
  };
  const logout = () => { setUser(null); Autenticacao.logout(); };
  const updateName = (name) => {
    const result = Autenticacao.updateName(name);
    if (result.ok) setUser(Autenticacao.currentUser());
    return result;
  };

  return (
    <CtxAuth.Provider value={{ user, login, register: Autenticacao.register, logout, updateName }}>
      {children}
    </CtxAuth.Provider>
  );
}
