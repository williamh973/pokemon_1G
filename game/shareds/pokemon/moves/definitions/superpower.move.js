export const SUPERPOWER_MOVE = {
  id: "superpower",
  name: "Surpuissance",
  type: ["FIGHT"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 120,
  precision: 100,
  desc: "Une attaque puissante, mais qui baisse l'Attaque et la Défense du lanceur.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: ["attack", "defense"],
    amount: 1,
    percentage: 100,
  },
};
