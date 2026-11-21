export const AGILITY_MOVE = {
  id: "agility",
  name: "Hâte",
  type: ["PSYCHIC"],
  class: ["STATUS"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "Le lanceur se relaxe et allège son corps pour beaucoup augmenter sa Vitesse.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "speed",
    amount: 2,
    percentage: 100,
  },
};
