export const BONEMERANG_MOVE = {
  id: "bonemerang",
  name: "Osmerang",
  type: ["GROUND"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 50,
  precision: 90,
  desc: "Le lanceur projette son os comme un boomerang. Cette attaque frappe à l'aller et au retour.",

  effect: {
    type: "TRAPPED",
  },
};
