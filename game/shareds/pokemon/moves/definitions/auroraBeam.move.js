export const AURORABEAM_MOVE = {
  id: "auroraBeam",
  name: "Onde Boréale",
  type: ["ICE"],
  class: ["SPECIAL"],
  pp: 20,
  power: 65,
  precision: 100,
  desc: "Envoie un rayon arc-en-ciel sur l'ennemi. Peut aussi baisser son Attaque.",

  effect: {
    type: "STAT_STAGE",
    stat: "attack",
    amount: -1,
    percentage: 10,
  },
};
