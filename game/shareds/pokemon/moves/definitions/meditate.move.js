export const MEDITATE_MOVE = {
  id: "meditate",
  name: "Yoga",
  type: ["PSYCHIC"],
  class: ["STATUS"],
  pp: 40,
  power: 0,
  precision: 100,
  desc: "Yoga augmente d'un niveau l'Attaque du lanceur.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "attack",
    amount: 1,
    percentage: 100,
  },
};
