export const normalizar = (s) =>
  String(s).normalizar('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const formatarTempo = (min) => (min <= 0 ? 'Chegando ›' : `${min} min ›`);
export const formatarPrevisao = (min) => (min <= 0 ? 'Chegando' : `${min} min`);
export const pessoas = (n) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`;
export const CLASSE_STATUS = { Cheio: 'full', Moderado: 'mid', Vazio: 'empty' };
