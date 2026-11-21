export const DREAMEATER_MOVE = {
  id: "dreamEater",
  name: "Dévorêve",
  type: ["PSYCHIC"],
  class: ["SPECIAL"],
  pp: 15,
  power: 100,
  precision: 100,
  desc: "Le lanceur mange le rêve de l'ennemi endormi et récupère en PV la moitié des dégâts infligés.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};
