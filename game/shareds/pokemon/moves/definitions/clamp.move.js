export const CLAMP_MOVE = {
  id: "clamp",
  name: "Claquoir",
  type: ["WATER"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 35,
  precision: 85,
  desc: "Claquoir inflige des dégâts, puis piège la cible sur le terrain pendant 4 à 5 tours",

  effect: {
    type: "TRAPPED",
  },
};
