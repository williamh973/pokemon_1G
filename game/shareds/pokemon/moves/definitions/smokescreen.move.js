export const SMOKESCREEN_MOVE = {
  id: "smokescreen",
  name: "Brouillard",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Le lanceur disperse un nuage d'encre ou de fumée. Réduit la Précision de l'ennemi.",

  effect: {
    type: "STAT_STAGE",
    stat: "accuracy",
    amount: -1,
    percentage: 100,
  },
};
