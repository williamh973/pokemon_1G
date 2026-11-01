export const EMBER_MOVE = {
  id: "ember",
  name: "Flammèche",
  type: ["FIRE"],
  class: ["SPECIAL"],
  pp: 25,
  power: 40,
  precision: 100,
  desc: "10% de chance de brûler la cible.",

  effect: {
    type: "STATUS",
    status: "BURN",
    percentage: 10,
  },
};
