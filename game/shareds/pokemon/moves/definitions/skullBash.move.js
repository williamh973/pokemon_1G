export const SKULLBASH_MOVE = {
  id: "skullBash",
  name: "Coud'Krâne",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  power: 130,
  precision: 100,
  pp: 10,
  desc: "Le lanceur augmente sa Défense au premier tour puis attaque au second.",

  effect: {
    type: "VOLATILE",
    volatile: "CHARGED_MOVE",
  },
};
