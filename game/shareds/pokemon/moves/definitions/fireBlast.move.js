export const FIREBLAST_MOVE = {
  id: "fireBlast",
  name: "Déflagration",
  type: ["FIRE"],
  class: ["SPECIAL"],
  pp: 5,
  power: 110,
  precision: 100,
  desc: "10% de chance de brûler la cible.",

  effect: {
    type: "STATUS",
    status: "BURN",
    percentage: 10,
  },
};
