export const MAWASHIGERI_MOVE = {
  id: "mawashigeri",
  name: "Mawashi Geri",
  type: ["FIGHT"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 60,
  precision: 85,
  desc: "Mawashi Geri inflige des dégâts et possède 30% de chances d'apeurer la cible.",

  effect: {
    type: "VOLATILE",
    volatile: "SCARE",
    percentage: 30,
  },
};
