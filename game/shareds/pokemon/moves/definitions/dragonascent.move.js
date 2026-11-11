export const DRAGONASCENT_MOVE = {
  id: "dragonascent",
  name: "Draco-Asc",
  type: ["FLYING"],
  class: ["PHYSICAL"],
  pp: 5,
  power: 120,
  precision: 100,
  desc: "Le Pokémon s'abat à toute vitesse sur la cible depuis les hautes couches de l'atmosphère. Baisse la Défense et la Défense Spéciale du lanceur.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: ["defense", "specialDef"],
    amount: 1,
    percentage: 100,
  },
};
