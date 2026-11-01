export const SUPERSONIC_MOVE = {
  id: "supersonic",
  name: "Ultrason",
  type: ["NORMAL"],
  class: ["STATUT"],
  power: 0,
  precision: 55,
  pp: 20,
  desc: "Attaque sonore. Rend confus la cible.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 100,
  },
};
