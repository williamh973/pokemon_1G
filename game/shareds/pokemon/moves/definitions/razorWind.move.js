export const RAZORWIND_MOVE = {
  id: "razorWind",
  name: "Coupe-Vent",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 80,
  precision: 75,
  desc: "Coupe-Vent est une capacité qui se lance en deux tours : le lanceur charge pendant le premier tour puis attaque le second",

  effect: {
    type: "VOLATILE",
    volatile: "CHARGED_MOVE",
  },
};
