export const ANCIENTPOWER_MOVE = {
  id: "ancientPower",
  name: "Pouv. Antique",
  type: ["ROCK"],
  class: ["SPECIAL"],
  pp: 5,
  power: 60,
  precision: 100,
  desc: "Une attaque préhistorique qui peut augmenter toutes les stats du lanceur d'un seul coup.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: ["attack", "defense", "specialAtt", "specialDef", "speed"],
    amount: 1,
    percentage: 10,
  },
};
