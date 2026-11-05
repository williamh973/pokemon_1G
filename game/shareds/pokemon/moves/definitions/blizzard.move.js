export const BLIZZARD_MOVE = {
  id: "blizzard",
  name: "Blizzard",
  type: ["ICE"],
  class: ["SPECIAL"],
  pp: 5,
  power: 65,
  precision: 100,
  desc: "Une violente tempête de neige s'abat sur l'ennemi. Peut aussi le geler.",

  effect: {
    type: "STATUS",
    stat: "FREEZE",
    percentage: 10,
  },
};
