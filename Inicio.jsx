import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListaOnibus from '../componentes/ListaOnibus';
import { useAutenticacao } from '../contextos/ContextoAuth';
import { useOnibus } from '../contextos/ContextoOnibus';
import { normalizar } from '../utilitarios/formatar';

const HOME_COUNT = 3;

export const corresponde = (b, q) => {
  const n = normalizar(q);
  return !n || [b.line, b.name, b.direction].some((v) => normalizar(v).includes(n));
};

function greeting(user) {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  const first = user?.name ? user.name.split(' ')[0] : 'usuário';
  return `${greet}, ${first}!`;
}

/** Tela: Próximos ônibus (#/inicio) */
export default function Inicio() {
  const { user } = useAutenticacao();
  const { buses } = useOnibus();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const found = buses.filter((b) => corresponde(b, q));
    return q.trim() ? found : found.slice(0, HOME_COUNT);
  }, [buses, q]);

  const onKeyDown = (e) => {
    const term = q.trim();
    if (e.key === 'Enter' && term) navigate(`/mapa?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="app-container main-screen">
      <header className="app-header">
        <div className="user-info">
          <h1>{greeting(user)}</h1>
          <p>Para onde você quer ir hoje?</p>
        </div>
        <div className="header-actions">
          <Link to="/config" className="user-avatar" title="Configurações" aria-label="Configurações"><i className="fa-solid fa-gear" /></Link>
          <Link to="/perfil" className="user-avatar" title="Perfil" aria-label="Perfil"><i className="fa-solid fa-user" /></Link>
        </div>
      </header>

      <label className="search-box">
        <i className="fa-solid fa-magnifying-glass" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Buscar endereço, linha de ônibus..." aria-label="Buscar endereço ou linha de ônibus" />
      </label>

      <div className="actions-grid">
        <Link to="/mapa" className="action-card">
          <i className="fa-solid fa-location-dot" />
          <h3>Buscar no mapa</h3>
          <p>Encontre pontos próximos</p>
        </Link>
        <Link to="/linhas" className="action-card">
          <i className="fa-solid fa-bus" />
          <h3>Linhas de ônibus</h3>
          <p>Veja horários e itinerários</p>
        </Link>
      </div>

      <section className="bus-section">
        <div className="section-header">
          <h2>Próximos ônibus</h2>
          <Link to="/linhas" className="see-all">Ver todos</Link>
        </div>
        <ListaOnibus items={items} theme="dark" emptyText="Nenhuma linha encontrada. Pressione Enter para buscar no mapa." />
      </section>

      <Link to="/mapa" className="footer-banner">
        <i className="fa-solid fa-bus-simple" />
        <span>
          <strong>Planeje sua viagem</strong>
          <small>Veja rotas, horários e quanto tempo vai levar</small>
        </span>
      </Link>
    </div>
  );
}
