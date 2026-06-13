import { ITEM_EFFECTS } from "./itemsEffect.database.js";

export const dispatchItemsSelection = (game, item, source) => {
  source.hasFocus = false;
  game.battleManager.isUseItem = true;
  game.battleManager.usedItem = item;

  return ITEM_EFFECTS[item.effect]?.({ game, item });
};
