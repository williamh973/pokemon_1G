export const HIGHJUMPKICK_MOVE = {
  id: "highjumpkick",
  name: "Pied Voltige",
  type: ["FIGHT"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 85,
  precision: 90,
  desc: "Le lanceur s'élance pour effectuer un coup de genou sauté. S'il échoue, le lanceur se blesse.",

  effect: {
    type: "VOLATILE",
    volatile: "SCARE",
    percentage: 30,
  },
};
