import { ITEMS_DATABASE } from "../../items/items.database.js";

export function getItemById(categoryKey, id) {
  return Object.values(ITEMS_DATABASE[categoryKey]).find(
    (item) => item.id === id
  );
}
