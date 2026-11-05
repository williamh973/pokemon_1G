export const EXPLOSION_MOVE = {
  id: "explosion",
  name: "Explosion",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 250,
  precision: 100,
  desc: "Le lanceur explose et inflige des dégâts à tous les Pokémon autour de lui. Met K.O. le lanceur.",

  consequence: {
    type: "K.O",
  },
};
