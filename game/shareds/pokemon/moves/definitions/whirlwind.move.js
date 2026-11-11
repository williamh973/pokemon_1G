export const WHIRLWIND_MOVE = {
  id: "whirlwind",
  name: "Cyclone",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Le lanceur disperse un nuage d'encre ou de fumée. Réduit la Précision de l'ennemi.",

  effect: {
    type: "END_BATTLE",
  },
};
