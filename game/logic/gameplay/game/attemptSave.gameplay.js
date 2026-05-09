import { Save } from "../../../models/MainMenu/items/Save/save.model.js";
import { DIALOGS_TREE_DATABASE } from "../../../shareds/dialogTree/dialogTree.database.js";

export const attemptSave = (game) => {
  game.isAttemptSave = true;
  game.save = new Save(game);
  game.openDialogBox(
    DIALOGS_TREE_DATABASE.saveSystem.start.text,
    DIALOGS_TREE_DATABASE.saveSystem
  );
};
