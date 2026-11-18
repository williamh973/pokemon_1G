export const FLASH_MOVE = {
  id: "flash",
  name: "Flash",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Une explosion lumineuse qui baisse la Précision de l'ennemi. Permet aussi d'éclairer les grottes trop sombres.",

  effect: {
    type: "STAT_STAGE",
    stat: "accuracy",
    amount: -1,
    percentage: 100,
  },
};
