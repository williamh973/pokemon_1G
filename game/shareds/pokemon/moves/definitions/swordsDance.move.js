export const SWORDSDANCE_MOVE = {
  id: "swordsDance",
  name: "Danse Lames",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Une danse frénétique qui exalte l'esprit combatif. Augmente beaucoup l'Attaque du lanceur.",

  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "attack",
    amount: 2,
    percentage: 100,
  },
};
