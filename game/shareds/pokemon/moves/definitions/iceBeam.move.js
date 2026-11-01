export const ICEBEAM_MOVE = {
  id: "iceBeam",
  name: "Laser Glace",
  type: ["ICE"],
  class: ["SPECIAL"],
  pp: 10,
  power: 95,
  precision: 100,
  desc: "10% de chance de geler la cible.",

  effect: {
    type: "STATUS",
    status: "FREEZE",
    percentage: 10,
  },
};
