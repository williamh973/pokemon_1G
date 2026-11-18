export const SOFTBOILED_MOVE = {
  id: "softBoiled",
  name: "E-Coque",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 5,
  power: 0,
  precision: 100,
  desc: "Le lanceur récupère jusqu'à la moitié de ses PV max. En dehors des combats, permet de transférer des PV du lanceur à un allié.",

  selfTarget: true,

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};
