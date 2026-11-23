export const SPIKECANNON_MOVE = {
  id: "spikeCannon",
  name: "Picanon",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 20,
  precision: 100,
  desc: "Picanon attaque de deux à cinq fois par tour",

  effect: {
    type: "MULTI_HIT",
    minCount: 2,
    maxCount: 5,
  },
};
