export const DOUBLETEAM_MOVE = {
  id: "doubleTeam",
  name: "Reflet",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 15,
  power: 0,
  precision: 100,
  desc: "Le lanceur se déplace si vite qu'il crée des copies illusoires de lui-même, augmentant son Esquive.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "dodge",
    amount: 1,
    percentage: 100,
  },
};
