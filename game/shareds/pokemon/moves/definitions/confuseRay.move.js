export const CONFUSERAY_MOVE = {
  id: "confuseRay",
  name: "Onde Folie",
  type: ["GHOST"],
  class: ["STATUT"],
  pp: 15,
  power: 0,
  precision: 100,
  desc: "Un rayon sinistre qui plonge l'ennemi dans un état de confusion.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 100,
  },
};
