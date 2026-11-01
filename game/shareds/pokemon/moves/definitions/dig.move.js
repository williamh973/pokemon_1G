export const DIG_MOVE = {
  id: "dig",
  name: "Tunnel",
  type: ["GROUND"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 1,
  precision: 100,
  desc: "Le lanceur creuse dans le sol au premier tour puis attaque au second.",

  effect: {
    type: "VOLATILE",
    volatile: "CHARGED_MOVE",
  },
};
