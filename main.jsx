import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './estilos/base.css';
import './estilos/inicio.css';
import './estilos/autenticacao.css';
import './estilos/mapa.css';
import './estilos/linha.css';
import './estilos/configuracoes.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
