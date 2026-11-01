export const SANDATTACK_MOVE = {
  id: "sandAttack",
  name: "Jet de Sable",
  type: ["GROUND"],
  class: ["STATUT"],
  pp: 15,
  power: 0,
  precision: 100,
  desc: "Baisse la Précision de la cible d'un niveau.",

  effect: {
    type: "STAT_STAGE",
    stat: "accuracy",
    amount: -1,
    percentage: 100,
  },
};
