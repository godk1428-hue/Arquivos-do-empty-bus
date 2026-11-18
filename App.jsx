import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SpriteIcones } from './componentes/Icones';
import RotaProtegida from './componentes/RotaProtegida';
import { ProvedorAuth } from './contextos/ContextoAuth';
import { ProvedorOnibus } from './contextos/ContextoOnibus';
import { ProvedorAjustes } from './contextos/ContextoAjustes';
import { ProvedorAviso } from './contextos/ContextoAviso';
import DetalheLinha from './paginas/DetalheLinha';
import Configuracoes from './paginas/Configuracoes';
import Inicio from './paginas/Inicio';
import Linhas from './paginas/Linhas';
import Entrar from './paginas/Entrar';
import Mapa from './paginas/Mapa';
import Perfil from './paginas/Perfil';

export default function App() {
  return (
    <HashRouter>
      <ProvedorAuth>
        <ProvedorAjustes>
          <ProvedorAviso>
            <ProvedorOnibus>
              <SpriteIcones />
              <Routes>
                <Route path="/login" element={<Entrar />} />
                <Route element={<RotaProtegida />}>
                  <Route path="/inicio" element={<Inicio />} />
                  <Route path="/linhas" element={<Linhas />} />
                  <Route path="/linha/:line" element={<DetalheLinha />} />
                  <Route path="/mapa" element={<Mapa />} />
                  <Route path="/config" element={<Configuracoes />} />
                  <Route path="/perfil" element={<Perfil />} />
                </Route>
                <Route path="*" element={<Navigate to="/inicio" replace />} />
              </Routes>
            </ProvedorOnibus>
          </ProvedorAviso>
        </ProvedorAjustes>
      </ProvedorAuth>
    </HashRouter>
  );
}
