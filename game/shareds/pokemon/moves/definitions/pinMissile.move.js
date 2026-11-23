export const PINMISSILE_MOVE = {
  id: "pinMissile",
  name: "Dard-Nuée",
  type: ["BUG"],
  class: ["PHYSICAL"],
  pp: 20,
  power: 14,
  precision: 85,
  desc: "Envoie une rafale de dards. Peut toucher de deux à cinq fois.",

  effect: {
    type: "MULTI_HIT",
    minCount: 2,
    maxCount: 5,
  },
};
