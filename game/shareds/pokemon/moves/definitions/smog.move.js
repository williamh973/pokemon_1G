export const SMOG_MOVE = {
  id: "smog",
  name: "Purédpois",
  type: ["POISON"],
  class: ["STATUS"],
  pp: 20,
  power: 20,
  precision: 70,
  desc: "Le lanceur attaque à l'aide d'une éruption de gaz répugnants. Peut aussi empoisonner l'ennemi.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 40,
  },
};
