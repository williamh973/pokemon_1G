import { createStatStages } from "./statStages.gameplay.js";

export const resetTeamStatStages = (party) => {
  party.slots.forEach((slot) => {
    if (!slot.content) return;
    slot.content.statStages = createStatStages();
  });
};
