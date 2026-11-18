import ItemOnibus from './ItemOnibus';

export default function ListaOnibus({ items, theme, emptyText }) {
  return (
    <div className="bus-list" aria-live="polite">
      {items.length
        ? items.map((b) => <ItemOnibus key={b.line} bus={b} theme={theme} />)
        : <p className="bus-empty">{emptyText}</p>}
    </div>
  );
}
