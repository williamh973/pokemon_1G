export const SUPERSONIC_MOVE = {
  id: "supersonic",
  name: "Ultrason",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 55,
  desc: "Attaque sonore. Rend confus la cible.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 100,
  },
};
