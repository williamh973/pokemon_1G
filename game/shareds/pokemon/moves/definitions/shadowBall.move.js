export const SHADOWBALL_MOVE = {
  id: "shadowBall",
  name: "Ball'Ombre",
  type: ["GHOST"],
  class: ["SPECIAL"],
  pp: 15,
  power: 1,
  precision: 100,
  desc: "Projette une grande ombre sur l'ennemi. Peut aussi baisser la puissance défensive de la cible.",

  effect: {
    type: "STAT_STAGE",
    volatile: "specialDef",
    percentage: 20,
  },
};
