import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { RECIFE, PARADAS } from '../dados/paradas';
import { useAjustes } from '../contextos/ContextoAjustes';
import { useAviso } from '../contextos/ContextoAviso';
import useArmazenamentoLocal from '../ganchos/useArmazenamentoLocal';
import { normalizar } from '../utilitarios/formatar';

const stopIcon = (isFav) =>
  L.divIcon({
    className: 'stop-marker',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${isFav ? '#f1c40f' : '#1e6fff'};
      color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.35);font-size:14px;"><i class="fa-solid fa-bus"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });

/** Tela: Mapa (#/mapa). Aceita ?q=, ?linha= e ?parada= */
export default function Mapa() {
  const toast = useAviso();
  const { locationOn } = useAjustes();
  const [params] = useSearchParams();
  const [favorites, setFavorites] = useArmazenamentoLocal('painel:favoritos', []);
  const [query, setQuery] = useState('');
  const [panelMode, setPanelMode] = useState(null); // 'favoritos' | 'paradas' | null

  const mapEl = useRef(null);
  const map = useRef(null);
  const base = useRef({});
  const currentBase = useRef('ruas');
  const stopsLayer = useRef(null);
  const markers = useRef(new Map());
  const userMarker = useRef(null);
  // refs para o popup (criado fora do ciclo do React) enxergar o estado mais recente
  const favRef = useRef(favorites);
  favRef.current = favorites;

  const toggleFavorite = (id) => {
    const wasFav = favRef.current.includes(id);
    setFavorites((f) => (wasFav ? f.filter((x) => x !== id) : [...f, id]));
    toast(wasFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos', 3000);
  };
  const toggleRef = useRef(toggleFavorite);
  toggleRef.current = toggleFavorite;

  // ---------- cria o mapa uma única vez ----------
  useEffect(() => {
    const m = L.map(mapEl.current, { zoomControl: false }).setView(RECIFE, 13);
    base.current = {
      ruas: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }),
      satelite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Tiles &copy; Esri' }),
    };
    base.current.ruas.addTo(m);
    stopsLayer.current = L.layerGroup().addTo(m);

    PARADAS.forEach((stop) => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: stopIcon(favRef.current.includes(stop.id)),
        title: stop.name,
        keyboard: true,
      }).bindPopup(() => {
        const box = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = stop.name;
        const lines = document.createElement('div');
        lines.textContent = `Linhas: ${stop.lines.join(', ')}`;
        const btn = document.createElement('button');
        btn.textContent = favRef.current.includes(stop.id) ? '★ Remover dos favoritos' : '☆ Favoritar';
        btn.style.cssText = 'margin-top:8px;padding:6px 10px;border:0;border-radius:8px;background:#1e6fff;color:#fff;cursor:pointer;';
        btn.onclick = () => {
          const wasFav = favRef.current.includes(stop.id);
          toggleRef.current(stop.id);
          btn.textContent = wasFav ? '☆ Favoritar' : '★ Remover dos favoritos';
        };
        box.append(title, lines, btn);
        return box;
      });
      markers.current.set(stop.id, marker);
      marker.addTo(stopsLayer.current);
    });

    map.current = m;
    return () => { m.remove(); map.current = null; markers.current.clear(); };
  }, []);

  // ícones dos marcadores acompanham os favoritos
  useEffect(() => {
    markers.current.forEach((marker, id) => marker.setIcon(stopIcon(favorites.includes(id))));
  }, [favorites]);

  const resetView = () => {
    stopsLayer.current.clearLayers();
    markers.current.forEach((m) => m.addTo(stopsLayer.current));
  };

  const focusStop = (stop) => {
    map.current.flyTo([stop.lat, stop.lng], 16, { duration: 0.8 });
    markers.current.get(stop.id)?.openPopup();
  };

  const search = (text) => {
    const q = normalizar(text);
    if (!q) return resetView();
    const found = PARADAS.filter((s) => normalizar(s.name).includes(q) || s.lines.some((l) => normalizar(l).includes(q)));
    if (!found.length) return toast('Nenhuma parada ou linha encontrada.', 3000);

    stopsLayer.current.clearLayers();
    found.forEach((s) => markers.current.get(s.id).addTo(stopsLayer.current));
    if (found.length === 1) focusStop(found[0]);
    else map.current.flyToBounds(L.latLngBounds(found.map((s) => [s.lat, s.lng])), { padding: [60, 60] });
  };

  // ---------- entrada na tela (?q= / ?linha= / ?parada=) ----------
  const qs = params.toString();
  useEffect(() => {
    const t = setTimeout(() => map.current?.invalidateSize(), 0);
    const stop = PARADAS.find((s) => s.id === params.get('parada'));
    if (stop) {
      resetView();
      setQuery(stop.name);
      const t2 = setTimeout(() => {
        map.current?.invalidateSize();
        map.current?.setView([stop.lat, stop.lng], 17, { animate: false });
        markers.current.get(stop.id)?.openPopup();
      }, 30);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    const initial = params.get('linha') || params.get('q') || '';
    setQuery(initial);
    initial ? search(initial) : resetView();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  // ---------- controles ----------
  const locate = () => {
    if (!locationOn) return toast('Localização desativada em Configurações.', 3000);
    if (!navigator.geolocation) return toast('Geolocalização não suportada neste navegador.', 3000);
    toast('Buscando sua localização...', 3000);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        userMarker.current?.remove();
        userMarker.current = L.circleMarker(pos, { radius: 8, color: '#fff', weight: 3, fillColor: '#1e6fff', fillOpacity: 1 }).addTo(map.current);
        map.current.flyTo(pos, 16);
      },
      (err) => toast(err.code === err.PERMISSION_DENIED ? 'Permissão de localização negada.' : 'Não foi possível obter sua localização.', 3000),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  };

  const toggleLayer = () => {
    map.current.removeLayer(base.current[currentBase.current]);
    currentBase.current = currentBase.current === 'ruas' ? 'satelite' : 'ruas';
    base.current[currentBase.current].addTo(map.current).bringToBack();
    toast(currentBase.current === 'ruas' ? 'Camada: ruas' : 'Camada: satélite', 3000);
  };

  const panelItems = panelMode === 'favoritos' ? PARADAS.filter((s) => favorites.includes(s.id)) : PARADAS;
  const fromLine = params.get('linha');
  const hasStop = PARADAS.some((s) => s.id === params.get('parada'));
  const backTo = hasStop && fromLine ? `/linha/${encodeURIComponent(fromLine)}` : '/inicio';

  return (
    <div className="app-container map-screen">
      <div className="map-view">
        <div className="map-placeholder" ref={mapEl} />
        <div className="floating-search-bar">
          <Link to={backTo} className="back-btn"><i className="fa-solid fa-arrow-left" /></Link>
          <input type="text" value={query} placeholder="Buscar endereço, linha de ônibus..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search(query)} />
          <button className="clear-btn" onClick={() => { setQuery(''); resetView(); }}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="floating-controls">
          <button className="control-btn" onClick={locate} aria-label="Minha localização"><i className="fa-solid fa-location-crosshairs" /></button>
          <button className="control-btn" onClick={toggleLayer} aria-label="Trocar camada"><i className="fa-solid fa-layer-group" /></button>
        </div>
      </div>

      <div className="bottom-sheet">
        <div className="drag-handle" onClick={() => setPanelMode(null)} />
        <div className="bottom-actions-grid">
          <button className={`sheet-button${panelMode === 'favoritos' ? ' active' : ''}`}
            onClick={() => setPanelMode((m) => (m === 'favoritos' ? null : 'favoritos'))}>
            <i className="fa-regular fa-star" /> favoritos
          </button>
          <button className={`sheet-button${panelMode === 'paradas' ? ' active' : ''}`}
            onClick={() => setPanelMode((m) => (m === 'paradas' ? null : 'paradas'))}>
            <i className="fa-solid fa-bus" /> Paradas
          </button>
        </div>

        {panelMode && (
          <div className="sheet-list">
            {panelItems.length ? panelItems.map((stop) => (
              <button key={stop.id} type="button" className="sheet-row" onClick={() => focusStop(stop)}>
                <span>
                  <strong>{stop.name}</strong><br />
                  <small>Linhas: {stop.lines.join(', ')}</small>
                </span>
                <span>{favorites.includes(stop.id) ? '★' : ''}</span>
              </button>
            )) : <p className="sheet-empty">Você ainda não tem favoritos. Toque em uma parada no mapa para favoritar.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
