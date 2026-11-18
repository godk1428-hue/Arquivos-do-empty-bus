import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useOnibus } from '../contextos/ContextoOnibus';
import { CLASSE_STATUS, formatarPrevisao, pessoas } from '../utilitarios/formatar';

const NOTES = { full: 'Ainda há espaço para ficar em pé', mid: 'Há assentos e espaço em pé', empty: 'Há muitos assentos disponíveis' };
const LEVEL = { full: 4, mid: 3, empty: 1 };
const REPORT_OPTIONS = [['empty', 'Vazio'], ['mid', 'Moderado'], ['full', 'Cheio']];

/** Tela: detalhe da linha e reportar lotação (#/linha/201) */
export default function DetalheLinha() {
  const { line } = useParams();
  const { state } = useLocation();
  const { buses, votes, isFavorite, toggleFavorite, vote } = useOnibus();

  const bus = buses.find((b) => b.line === line);
  if (!bus) return <Navigate to="/linhas" replace />;

  const back = state?.from || '/linhas';
  const c = bus.counts;
  const total = bus.reports;
  const cls = CLASSE_STATUS[bus.status];
  const mine = votes[bus.line];
  const fav = isFavorite(bus.line);
  const stops = [bus.name, ...bus.via, 'Centro'];

  return (
    <main className="app-container bd-screen">
      <header className="bd-top">
        <div className="bd-top-left">
          <Link className="bd-back" to={back} aria-label="Voltar"><i className="fa-solid fa-arrow-left" /></Link>
          <h1>Linha {bus.line}</h1>
        </div>
        <button type="button" className="bd-fav" aria-pressed={fav}
          aria-label={fav ? 'Remover dos favoritos' : 'Favoritar linha'} onClick={() => toggleFavorite(bus.line)}>
          <i className={`${fav ? 'fa-solid' : 'fa-regular'} fa-star`} />
        </button>
      </header>

      <section className="bd-card">
        <div className={`bd-badge badge-${bus.line}`} style={bus.color ? { background: bus.color } : undefined}>{bus.line}</div>
        <div className="bd-info">
          <span className="bd-name">{bus.name}</span>
          <span className="bd-dir">Direção: {bus.direction}</span>
          <span className={`bd-chip ${cls}`}><i className="fa-solid fa-user-group" /> {bus.status}</span>
        </div>
        <div className="bd-eta"><span>{formatarPrevisao(bus.minutes)}</span><i className="fa-solid fa-chevron-right" /></div>
      </section>

      <h2 className="bd-title">Ocupação de ônibus</h2>
      <div className={`bd-meter ${cls}`} role="img" aria-label={`Ocupação: ${LEVEL[cls]} de 5 níveis`}>
        {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i < LEVEL[cls] ? '' : 'off'} />)}
      </div>
      <p className="bd-note"><i className="fa-solid fa-user" /> {NOTES[cls]}</p>

      <section className="bd-report" aria-labelledby="bd-rep-title">
        <h2 id="bd-rep-title">Reportar lotação</h2>
        <p>Ajude outros passageiros: como está o ônibus agora?</p>
        <div className="bd-options">
          {REPORT_OPTIONS.map(([key, label]) => (
            <button key={key} type="button" className={`bd-rbtn ${key}`} aria-pressed={mine === key}
              onClick={() => vote(bus.line, key)}>
              <span className="bd-label"><span className="bd-dot" />{label}</span>
              <span className="bd-count">{pessoas(c[key])}</span>
            </button>
          ))}
        </div>
        <div className="bd-total">{total} {total === 1 ? 'pessoa reportou' : 'pessoas reportaram'} nos últimos 15 min</div>
        {mine && <p className="bd-thanks" role="status">Obrigado por ajudar! Toque de novo no mesmo botão para desfazer.</p>}
      </section>

      <h2 className="bd-route-title">Itinerário</h2>
      <ol className="bd-route">
        {stops.map((name, i) => {
          const end = i === 0 || i === stops.length - 1;
          return (
            <li key={name} className={`bd-stop${end ? ' end' : ''}`}>
              <span className="bd-pin" />{name}
              {i === 0 && <span className="bd-tag">Início</span>}
              {i === stops.length - 1 && <span className="bd-tag">Fim</span>}
            </li>
          );
        })}
      </ol>

      <Link className="bd-map" to={`/mapa?parada=${encodeURIComponent(bus.stop)}&linha=${encodeURIComponent(bus.line)}`}>
        <i className="fa-solid fa-map" /> Ver no mapa
      </Link>
    </main>
  );
}
