export const FLY_MOVE = {
  id: "fly",
  name: "Vol",
  type: ["FLYING"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 70,
  precision: 95,
  priority: 0,
  desc: "Le lanceur s'envole au premier tour puis attaque au second.",

  effect: {
    type: "VOLATILE",
    volatile: "CHARGED_MOVE",
  },
};
