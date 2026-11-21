export const LICK_MOVE = {
  id: "lick",
  name: "Léchouille",
  type: ["GHOST"],
  class: ["PHYSICAL"],
  pp: 30,
  power: 20,
  precision: 100,
  desc: "Un grand coup de langue qui inflige des dégâts à l'ennemi. Peut aussi le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 30,
  },
};
