export const PSYWAVE_MOVE = {
  id: "psywave",
  name: "Vague Psy",
  type: ["PSYCHIC"],
  class: ["SPECIAL"],
  pp: 15,
  power: 1,
  precision: 80,
  desc: "Inflige des dégâts variables entre 1 PV et 150% du niveau du lanceur.",

  effect: {
    type: "VARIABLE_DAMAGE",
  },
};
