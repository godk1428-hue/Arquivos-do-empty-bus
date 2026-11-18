// counts = relatos de lotação dos últimos 15 min (mock); stop = id da parada no mapa
export const ONIBUS = [
  { line: '201', name: 'Terminal Central', direction: 'Centro', minutes: 3,  stop: 'terminal-central',  counts: { empty: 1,  mid: 4,  full: 22 }, via: ['Av. Brasil', 'Praça da Liberdade', 'Hospital Municipal'] },
  { line: '307', name: 'Joana Bezerra',    direction: 'Centro', minutes: 7,  stop: 'ti-joana-bezerra', counts: { empty: 19, mid: 3,  full: 0 },  via: ['Rua das Acácias', 'Escola Estadual', 'Mercado Público'] },
  { line: '412', name: 'Boa Vista',        direction: 'Centro', minutes: 12, stop: 'boa-vista',        counts: { empty: 3,  mid: 12, full: 4 },  via: ['Rua da Aurora', 'Ponte Princesa Isabel', 'Praça da República'] },
  { line: '518', name: 'Derby',            direction: 'Centro', minutes: 18, stop: 'derby',            counts: { empty: 2,  mid: 9,  full: 3 },  via: ['Av. Conde da Boa Vista', 'Praça Maciel Pinheiro', 'Mercado de São José'], color: '#8e44ad' },
  { line: '623', name: 'Boa Viagem',       direction: 'Centro', minutes: 25, stop: 'boa-viagem',       counts: { empty: 8,  mid: 2,  full: 0 },  via: ['Av. Domingos Ferreira', 'Pina', 'Ponte Paulo Guerra'], color: '#16a085' },
];
