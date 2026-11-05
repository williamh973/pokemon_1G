export const SELFDESTRUC_MOVE = {
  id: "selfDestruct",
  name: "Destruction",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 200,
  precision: 100,
  desc: "Le lanceur explose en blessant tous les Pokémon autour de lui. Le lanceur tombe K.O.",

  consequence: {
    type: "K.O",
  },
};
