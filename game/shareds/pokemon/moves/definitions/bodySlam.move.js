export const BODYSLAM_MOVE = {
  id: "bodySlam",
  name: "Plaquage",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 85,
  precision: 100,
  desc: "Le lanceur se laisse tomber sur l'ennemi de tout son poids. Peut aussi le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 30,
  },
};
