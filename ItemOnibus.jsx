import { useLocation, useNavigate } from 'react-router-dom';
import { useOnibus } from '../contextos/ContextoOnibus';
import { CLASSE_STATUS, formatarTempo } from '../utilitarios/formatar';

function FavButton({ line }) {
  const { isFavorite, toggleFavorite } = useOnibus();
  const on = isFavorite(line);
  return (
    <button
      type="button"
      className="fav"
      aria-pressed={on}
      aria-label={on ? `Remover linha ${line} dos favoritos` : `Favoritar linha ${line}`}
      onClick={(e) => { e.stopPropagation(); toggleFavorite(line); }}
    >
      <i className={`${on ? 'fa-solid' : 'fa-regular'} fa-star`} />
    </button>
  );
}

/** Card de uma linha. theme = 'dark' (início) ou 'light' (lista de linhas). */
export default function ItemOnibus({ bus, theme }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const go = () => navigate(`/linha/${bus.line}`, { state: { from: pathname } });

  return (
    <div
      className={`bus-item ${theme}`}
      tabIndex={0}
      role="link"
      aria-label={`Linha ${bus.line}, ${bus.name}, ${formatarTempo(bus.minutes)}, ${bus.status}`}
      onClick={go}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(); }
      }}
    >
      <div className={`bus-number badge-${bus.line}`} style={bus.color ? { background: bus.color } : undefined}>
        {bus.line}
      </div>
      <div className="bus-details">
        <strong>{bus.name}</strong>
        <span>Direção: {bus.direction}</span>
        {theme === 'dark' && <span>Relatos: {bus.reports}</span>}
      </div>
      <div className="bus-side">
        <div className="bus-row">
          {theme === 'light' && <FavButton line={bus.line} />}
          <div className="bus-time">{formatarTempo(bus.minutes)}</div>
        </div>
        <span className={`pill ${CLASSE_STATUS[bus.status]}`}>
          <i className="fa-solid fa-bus" /> {bus.status}
        </span>
      </div>
    </div>
  );
}
