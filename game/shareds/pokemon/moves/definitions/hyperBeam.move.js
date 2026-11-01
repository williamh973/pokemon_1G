export const HYPERBEAM_MOVE = {
  id: "hyperBeam",
  name: "Ultralaser",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 150,
  precision: 90,
  priority: 0,
  desc: "Le lanceur doit se reposer au tour suivant.",

  consequence: {
    type: "RECHARGE",
  },
};
