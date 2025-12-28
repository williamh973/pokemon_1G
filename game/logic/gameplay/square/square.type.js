export const SQUARE_TYPES = {
  1: { walkable: true, encounter: true, terrain: "ground" },
  2: { walkable: true, encounter: false, terrain: "ground" },
  3: { walkable: false, encounter: false, terrain: "solid" },
  4: { walkable: false, encounter: false, terrain: "water" },
  5: {
    walkable: true,
    encounter: false,
    terrain: "ground",
    trigger: "door",
    warp: true,
  },
  6: {
    walkable: true,
    encounter: false,
    terrain: "ground",
    trigger: "door",
    warp: false,
  },
};
