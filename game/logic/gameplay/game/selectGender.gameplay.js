import { DIALOGS_TREE_DATABASE } from "../../../shareds/dialogTree/dialogTree.database.js";

export const selectGender = (game) => {
  game.openDialogBox(
    DIALOGS_TREE_DATABASE.selectGender.start.text,
    DIALOGS_TREE_DATABASE.selectGender,
    () => game.mapManager.loadMap(game.mapManager.currentMap.id)
  );
};
