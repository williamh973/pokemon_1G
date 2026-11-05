export const FLAMETHROWER_MOVE = {
  id: "flamethrower",
  name: "Lance-Flamme",
  type: ["FIRE"],
  class: ["SPECIAL"],
  pp: 15,
  power: 90,
  precision: 100,
  desc: "10% de chance de brûler la cible.",

  effect: {
    type: "STATUS",
    status: "BURN",
    percentage: 10,
  },
};
