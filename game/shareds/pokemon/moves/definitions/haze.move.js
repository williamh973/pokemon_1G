export const HAZE_MOVE = {
  id: "haze",
  name: "Buée Noire",
  type: ["ICE"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "Crée un brouillard qui annule les changements de stats de tous les Pokémon au combat.",
  selfTarget: true,

  effect: {
    type: "NEGATES_STAT_STAGE_CHANGE",
  },
};
