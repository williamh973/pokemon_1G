export const SONICBOOM_MOVE = {
  id: "sonicBoom",
  name: "Sonicboom",
  type: ["NORMAL"],
  class: ["SPECIAL"],
  pp: 20,
  power: 0,
  precision: 90,
  desc: "Sonic Boom enlève toujours 20 PV à la cible, sauf si celle-ci est du type Spectre.",

  effect: {
    type: "STATIC_DAMAGE",
    amount: 20,
  },
};
