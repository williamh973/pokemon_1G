export const CONFUSION_MOVE = {
  id: "confusion",
  name: "Choc Mental",
  type: ["PSYCHIC"],
  class: ["SPECIAL"],
  pp: 25,
  power: 50,
  precision: 100,
  desc: "Une faible vague télékinétique frappe l'ennemi. Peut aussi le plonger dans la confusion.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 10,
  },
};
