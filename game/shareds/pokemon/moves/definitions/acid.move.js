export const ACID_MOVE = {
  id: "acid",
  name: "Acide",
  type: ["POISON"],
  class: ["SPECIAL"],
  pp: 30,
  power: 40,
  precision: 100,
  desc: "Le lanceur attaque l'ennemi avec un jet d'acide corrosif. Peut aussi baisser sa Défense Spéciale.",

  effect: {
    type: "STAT_STAGE",
    stat: "specialDef",
    amount: -1,
    percentage: 10,
  },
};
