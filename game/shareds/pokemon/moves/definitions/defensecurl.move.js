export const DEFENSECURL_MOVE = {
  id: "defensecurl",
  name: "Boul'Armure",
  type: ["NORMAL"],
  class: ["STATUS"],
  pp: 40,
  power: 0,
  precision: 100,
  desc: "Le lanceur s'enroule pour cacher ses points faibles, ce qui augmente sa Défense.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 1,
    percentage: 100,
  },
};
