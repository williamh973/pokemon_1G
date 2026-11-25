export const DISABLE_MOVE = {
  id: "disable",
  name: "Entrave",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 55,
  desc: "Empêche l'ennemi d'employer à nouveau sa dernière attaque. Dure quatre tours.",

  effect: {
    type: "VOLATILE",
    volatile: "PREVENTS_LAST_MOVE",
    percentage: 100,
  },
};
