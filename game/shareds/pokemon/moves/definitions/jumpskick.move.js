export const JUMPSKICK_MOVE = {
  id: "jumpskick",
  name: "Pied Sauté",
  type: ["FIGHT"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 70,
  precision: 95,
  desc: "Pied Sauté inflige des dégâts et possède 30% de chances d'apeurer la cible.",

  effect: {
    type: "VOLATILE",
    volatile: "SCARE",
    percentage: 30,
  },
};
