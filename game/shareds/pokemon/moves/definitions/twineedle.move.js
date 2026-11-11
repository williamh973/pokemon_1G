export const TWINEEDLE_MOVE = {
  id: "twineedle",
  name: "Double-Dard",
  type: ["BUG"],
  class: ["PHYSICAL"],
  pp: 20,
  power: 25,
  precision: 100,
  desc: "Double Dard possède une puissance minime, de 25, mais elle frappe deux fois - ce qui lui donne en réalité une puissance de 50.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 20,
  },
};
