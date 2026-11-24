export const BITE_MOVE = {
  id: "bite",
  name: "Morsure",
  type: ["DARK"],
  class: ["PHYSICAL"],
  pp: 25,
  power: 60,
  precision: 100,
  desc: "L'ennemi est mordu par de tranchantes canines. Peut l'apeurer.",

  effect: {
    type: "VOLATILE",
    volatile: "FRIGHTEN",
    percentage: 30,
  },
};
