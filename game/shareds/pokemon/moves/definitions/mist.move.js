export const MIST_MOVE = {
  id: "mist",
  name: "Brume",
  type: ["ICE"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "Une brume blanche enveloppe l'équipe du lanceur et empêche la réduction des stats pour cinq tours.",
  selfTarget: true,

  effect: {
    type: "PREVENTS_STAT_STAGE",
    percentage: 100,
  },
};
