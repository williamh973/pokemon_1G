import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { Npc } from "../npc.model.js";

export class MissableObject extends Npc {
  constructor({ key, tileX, tileY, id, category, flagId, name }) {
    super({
      tileX,
      tileY,
      sprites: {
        idle: OBJECT_SPRITES.pokeball.idle,
      },
      facing: "down",
    });
    this.itemId = id;
    this.flagId = flagId;
    this.itemKey = key;
    this.category = category;
    this.name = name;
  }

  getItem() {
    const category = ITEMS_DATABASE[this.category];
    const item = category[this.itemKey];
    return item;
  }

  interact(game) {
    if (game.flags[this.flagId]) return;

    const item = this.getItem();

    game.inventory.add(item, this.category);
    game.flags[this.flagId] = true;
    game.openDialogBox(`Vous obtenez ${item.name} !`, null);
    this.remove(game);
  }

  remove(game) {
    game.mapManager.currentMap.npcs = game.mapManager.currentMap.npcs.filter(
      (item) => item.flagId !== this.flagId
    );
  }
}
