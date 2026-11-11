export const IRONTAIL_MOVE = {
  id: "irontail",
  name: "Queue de Fer",
  type: ["STEEL"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 100,
  precision: 100,
  desc: "Attaque l'ennemi avec une queue de fer. Peut aussi baisser sa Défense.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 1,
    percentage: 30,
  },
};
