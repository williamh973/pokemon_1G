export const ROAR_MOVE = {
  id: "roar",
  name: "Hurlement",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Effraie le Pokémon ennemi et le remplace par un autre. Lors d'un combat contre un Pokémon sauvage seul, met fin au combat.",

  effect: {
    type: "FLEE",
  },
};
