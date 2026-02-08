import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { Npc } from "../npc.model.js";

export class ObjectNpc extends Npc {
  constructor(tileX, tileY, itemId, objectCategory, flagId) {
    const sprites = {
      idle: OBJECT_SPRITES.pokeball.idle,
    };
    super({
      tileX,
      tileY,
      sprites: sprites,
      facing: "down",
    });
    this.itemId = itemId;
    this.flagId = flagId;
    this.isStatic = true;
    this.objectCategory = objectCategory;
  }

  interact(game) {
    if (game.flags[this.flagId]) return;

    const itemsData = ITEMS_DATABASE;
    const foundedCategory = itemsData[this.objectCategory];
    const foundedItem = foundedCategory[this.itemId];

    game.inventory.add(foundedItem);
    game.flags[this.flagId] = true;

    game.openDialogBox(`Vous obtenez ${foundedItem.name} !`, null);
    this.destroy(game);
  }
  destroy(game) {
    game.currentMap.npcs = game.currentMap.npcs.filter(
      (item) => item.flagId !== this.flagId
    );
  }
}
