import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { TILES_SIZE } from "../../../../../shareds/utils/tile/tile.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";

export class InventoryContextMenu extends Menu {
  constructor(game, item) {
    super(game);
    this.game = game;
    this.item = item;
    this.items = [
      { id: "USE", name: "UTILISER" },
      { id: "REMOVE", name: "JETER" },
      { id: "RETOUR", name: "RETOUR" },
    ];
    this.width = this.game.canvas.width / 2 - TILES_SIZE;
    this.height = 30 * this.items.length;
    this.position = {
      x: this.game.canvas.width - this.width,
      y: this.game.canvas.height - this.height - 70,
    };
  }

  draw(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );

    this.drawItems(context);

    this.showCursor(context);
  }

  close() {
    super.close();

    const inventory = this.game.player.inventory;
    inventory.contextMenu = null;
    inventory.hasFocus = true;
  }

  checkIfItemCanBeUsed() {
    const allowedEffectsInOpenWorlds = [
      "REVIVE",
      "USE_BICYCLE",
      "LEVEL_UP",
      "OPEN_WORLDMAP",
    ];

    if (allowedEffectsInOpenWorlds.includes(this.item.effect)) return true;
    else return false;
  }

  useItem() {
    if (this.item.id === "RETOUR") return this.openItem(this.item.id);

    const itemCanUsedInWorld = this.checkIfItemCanBeUsed();
    if (this.game.battleManager) {
      if (itemCanUsedInWorld) {
        const text = "Objet inutilisable en combat";
        return this.game.player.inventory.openDialogBox(false, text);
      } else {
        this.game.handleItemSelection(this.item, this);
      }
    } else {
      const text = "Objet utilisable uniquement \nen combat";
      return this.game.player.inventory.openDialogBox(false, text);
    }
  }

  update(context, action) {
    super.update(action);

    this.draw(context);

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.close();
        break;

      case INPUT_STATE.ACTION:
        this.useItem();
        break;
    }
  }
}
