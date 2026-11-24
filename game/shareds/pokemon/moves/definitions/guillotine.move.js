export const GUILLOTINE_MOVE = {
  id: "guillotine",
  name: "Guillotine",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 1,
  precision: 30,
  desc: "Des pinces lacèrent violemment l'ennemi, le mettant K.O. sur le coup s'il est touché.",

  effect: {
    type: "OHKO",
  },
};
