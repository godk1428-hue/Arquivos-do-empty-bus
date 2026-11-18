import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ListaOnibus from '../componentes/ListaOnibus';
import { useOnibus } from '../contextos/ContextoOnibus';
import { corresponde } from './Inicio';

const NEAR_MINUTES = 10;
const FILTERS = [['all', 'Todas'], ['near', 'Mais próximos'], ['fav', 'Favoritos']];

/** Tela: Linhas de ônibus (#/linhas). Aceita ?filtro=fav */
export default function Linhas() {
  const { buses, isFavorite } = useOnibus();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(params.get('filtro') === 'fav' ? 'fav' : 'all');

  const items = useMemo(() => {
    let list = buses.filter((b) => corresponde(b, q));
    if (filter === 'near') list = list.filter((b) => b.minutes <= NEAR_MINUTES);
    if (filter === 'fav') list = list.filter((b) => isFavorite(b.line));
    return list;
  }, [buses, q, filter, isFavorite]);

  return (
    <div className="app-container main-screen">
      <header className="topbar">
        <Link to="/inicio" className="back" aria-label="Voltar"><i className="fa-solid fa-arrow-left" /></Link>
        <h1>Linhas de ônibus</h1>
      </header>

      <label className="search-box">
        <i className="fa-solid fa-magnifying-glass" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar linhas, destinos ou região..." aria-label="Buscar linhas, destinos ou região" />
      </label>

      <div className="chips">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" className="chip" aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <ListaOnibus items={items} theme="light"
        emptyText={filter === 'fav' ? 'Você ainda não tem linhas favoritas.' : 'Nenhuma linha encontrada.'} />
    </div>
  );
}
