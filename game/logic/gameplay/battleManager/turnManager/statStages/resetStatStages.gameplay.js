import { createStatStages } from "./createStatStages.gameplay.js";

export const resetTeamStatStages = (party) => {
  party.slots.forEach((slot) => {
    if (!slot.content) return;
    slot.content.statStages = createStatStages();
  });
};
