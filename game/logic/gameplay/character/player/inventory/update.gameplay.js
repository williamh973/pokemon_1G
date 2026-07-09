import { INPUT_STATE } from "../../../../input/inputs.state.js";
import { GAME_STATES } from "../../../game/states/states.gameplay.js";

export const update = (inventory, context, action) => {
  if (!inventory.isOpen) return;

  inventory.draw(context);

  if (inventory.dialogBox.isOpen)
    inventory.dialogBox.update(inventory.game.canvas.context, action);

  if (inventory.cursor)
    inventory.cursor.update(
      context,
      inventory.cursor.position.x + 10,
      inventory.position.y +
        inventory.itemCurrentIndex * inventory.lineHeight +
        45,
      false
    );

  inventory.contextMenu?.update(context, action);

  if (inventory.hasFocus)
    switch (action) {
      case "UP":
        if (inventory.itemCurrentIndex > 0) {
          inventory.itemCurrentIndex--;
          inventory.openDialogBox(true);
        }
        break;

      case "DOWN":
        if (inventory.itemCurrentIndex < inventory.categories.length - 1) {
          inventory.itemCurrentIndex++;
          inventory.openDialogBox(true);
        }
        break;

      case "RIGHT":
        if (inventory.catCurrentIndex < inventory.categoryLabels.length - 1) {
          inventory.catCurrentIndex++;
          inventory.itemCurrentIndex = 0;
          inventory.openDialogBox(true);
        }
        break;

      case "LEFT":
        if (inventory.catCurrentIndex > 0) {
          inventory.catCurrentIndex--;
          inventory.itemCurrentIndex = 0;
          inventory.openDialogBox(true);
        }
        break;

      case INPUT_STATE.ACTION:
        inventory.openContextMenu();
        break;

      case GAME_STATES.PLAYER_MENU:
      case "ESCAPE":
        inventory.game.closeAndReturnFromSubMenu();
        break;
    }
};
