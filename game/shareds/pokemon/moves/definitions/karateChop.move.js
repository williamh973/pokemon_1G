export const KARATECHOP_MOVE = {
  id: "karateChop",
  name: "Poing-Karaté",
  type: ["FIGHT"],
  class: ["PHYSICAL"],
  pp: 25,
  power: 50,
  precision: 100,
  desc: "Poing Karaté inflige des dégâts avec un taux élevé de coups critiques.",

  effect: {
    type: "HIGH_CC_RATE",
  },
};
