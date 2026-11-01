export const TAILWHIP_MOVE = {
  id: "tailWhip",
  name: "Mimi-Queue",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 35,
  power: 0,
  precision: 100,
  desc: "Réduit la Défense de l'adversaire d'un niveau.",

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: -1,
    percentage: 100,
  },
};
