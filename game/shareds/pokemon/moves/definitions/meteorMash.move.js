export const METEORMASH_MOVE = {
  id: "meteorMash",
  name: "Poing Météore",
  type: ["STEEL"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 90,
  precision: 90,
  desc: "Un coup de poing lancé à la vitesse d'un météore. Peut aussi augmenter l'Attaque du lanceur.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "attack",
    amount: 1,
    percentage: 20,
  },
};
