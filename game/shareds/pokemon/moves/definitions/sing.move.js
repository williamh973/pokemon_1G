export const SING_MOVE = {
  id: "sing",
  name: "Berceuse",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 15,
  power: 0,
  precision: 55,
  desc: "Une berceuse plonge l'ennemi dans un profond sommeil.",

  effect: {
    type: "STATUS",
    status: "SLEEP",
    percentage: 100,
  },
};
