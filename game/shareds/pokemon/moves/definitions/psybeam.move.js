export const PSYBEAM_MOVE = {
  id: "psybeam",
  name: "Rafale Psy",
  type: ["PSYCHIC"],
  class: ["SPECIAL"],
  pp: 40,
  power: 65,
  precision: 100,
  desc: "Un étrange rayon frappe l'ennemi. Peut aussi le rendre confus.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 10,
  },
};
