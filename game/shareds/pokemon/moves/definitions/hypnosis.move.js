export const HYPNOSIS_MOVE = {
  id: "hypnosis",
  name: "Hypnose",
  type: ["PSYCHIC"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 60,
  desc: "Endort la cible.",

  effect: {
    type: "STATUS",
    status: "SLEEP",
    percentage: 100,
  },
};
