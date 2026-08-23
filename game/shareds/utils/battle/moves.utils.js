import { MOVE_ANIMATIONS_DATABASE } from "../../pokemon/moves/moveAnimations.database.js";

export const getMoveAnimationById = (moveId) =>
  MOVE_ANIMATIONS_DATABASE[moveId];
