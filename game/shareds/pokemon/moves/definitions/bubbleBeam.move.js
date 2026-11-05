export const BUBBLEBEAM_MOVE = {
  id: "bubbleBeam",
  name: "Bulles d'O",
  type: ["WATER"],
  class: ["SPECIAL"],
  pp: 20,
  power: 65,
  precision: 100,
  desc: "Des bulles sont envoyées avec puissance sur l'ennemi. Peut aussi baisser sa Vitesse.",

  effect: {
    type: "STAT_STAGE",
    stat: "speed",
    amount: -1,
    percentage: 10,
  },
};
