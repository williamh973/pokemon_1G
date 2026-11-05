export const FIRESPIN_MOVE = {
  id: "fireSpin",
  name: "Danse Flammes",
  type: ["FIRE"],
  class: ["SPECIAL"],
  pp: 15,
  power: 35,
  precision: 85,
  desc: "Un tourbillon de flammes emprisonne la cible pendant quatre à cinq tours.",

  effect: {
    type: "STATUS",
    status: "BURN",
    percentage: 10,
  },
};
