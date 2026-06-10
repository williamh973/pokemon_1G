export const openDialogBox = (inventory, itemCanUsedInWorld) => {
  if (itemCanUsedInWorld) {
    const item = inventory.categories[inventory.itemCurrentIndex];
    item && item.desc
      ? inventory.dialogBox.open(item?.desc, true)
      : inventory.dialogBox.open("", true);
  }

  if (!itemCanUsedInWorld)
    inventory.dialogBox.open("Objet utilisable uniquement \nen combat", true);
};
