import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacao } from '../contextos/ContextoAuth';

/** Só deixa passar quem está logado. */
export default function RotaProtegida() {
  const { user } = useAutenticacao();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
