export const SLEEPPOWDER_MOVE = {
  id: "sleepPowder",
  name: "Poudre Dodo",
  type: ["GRASS"],
  class: ["STATUS"],
  pp: 15,
  power: 0,
  precision: 75,
  desc: "Le lanceur répand une poudre soporifique qui endort la cible.",

  effect: {
    type: "STATUS",
    status: "SLEEP",
    percentage: 100,
  },
};
