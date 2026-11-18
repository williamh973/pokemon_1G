export const LOVELYKISS_MOVE = {
  id: "lovelyKiss",
  name: "Grobisou",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 10,
  power: 0,
  precision: 75,
  desc: "Le lanceur fait un bisou à l'ennemi en prenant une mine effrayante. Endort l'ennemi.",

  effect: {
    type: "STATUS",
    status: "SLEEP",
    percentage: 100,
  },
};
