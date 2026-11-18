export const MINIMIZE_MOVE = {
  id: "minimize",
  name: "Lilliput",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 10,
  power: 0,
  precision: 100,
  desc: "Le lanceur comprime son corps pour se faire tout petit et beaucoup augmenter son Esquive.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "dodge",
    amount: 2,
    percentage: 100,
  },
};
