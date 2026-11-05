export const PSYCHIC_MOVE = {
  id: "psychic",
  name: "Psyko",
  type: ["PSYCHIC"],
  class: ["SPECIAL"],
  pp: 10,
  power: 90,
  precision: 100,
  desc: "Une puissante force télékinétique frappe l'ennemi. Peut aussi faire baisser sa Défense Spéciale.",

  effect: {
    type: "STAT_STAGE",
    stat: "specialDef",
    amount: -1,
    percentage: 10,
  },
};
