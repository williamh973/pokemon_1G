export const BIND_MOVE = {
  id: "bind",
  name: "Étreinte",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 20,
  power: 15,
  precision: 75,
  desc: "Ligote la cible pour lui infliger les même dégats que le premier coup à la fin de chaque tour pendant 2 à 5 tours.",

  effect: {
    type: "TRAPPED",
  },
};
