export const THUNDERWAVE_MOVE = {
  id: "thunderWave",
  name: "Cage-Éclair",
  type: ["ELECTRIK"],
  class: ["STATUS"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Paralyse la cible.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 100,
  },
};
