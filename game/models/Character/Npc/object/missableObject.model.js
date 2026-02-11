import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { Npc } from "../npc.model.js";

export class MissableObject extends Npc {
  constructor(tileX, tileY, itemId, category, flagId) {
    super({
      tileX,
      tileY,
      sprites: {
        idle: OBJECT_SPRITES.pokeball.idle,
      },
      facing: "down",
    });
    this.itemId = itemId;
    this.flagId = flagId;
    this.category = category;
  }

  getItem() {
    const itemsData = ITEMS_DATABASE;
    const category = itemsData[this.category];
    const item = category[this.itemId];
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
    game.currentMap.npcs = game.currentMap.npcs.filter(
      (item) => item.flagId !== this.flagId
    );
  }
}
