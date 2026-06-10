import { ITEM_EFFECTS } from "./itemsEffect.database.js";

export const dispatchItemsSelection = (game, item, source) => {
  source.hasFocus = false;

  return ITEM_EFFECTS[item.effect]?.({ game, item });
};
