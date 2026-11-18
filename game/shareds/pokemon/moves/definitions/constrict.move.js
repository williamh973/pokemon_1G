export const CONSTRICT_MOVE = {
  id: "constrict",
  name: "Constriction",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 0,
  precision: 100,
  desc: "Des pinces lacèrent violemment l'ennemi, le mettant K.O. sur le coup s'il est touché.",

  effect: {
    type: "OHKO",
  },
};
