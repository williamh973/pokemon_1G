export const openDialogBox = (inventory, itemCanUsedInWorld, text) => {
  if (itemCanUsedInWorld) {
    const item = inventory.categories[inventory.itemCurrentIndex];
    item && item.desc
      ? inventory.dialogBox.open(item?.desc, true)
      : inventory.dialogBox.open("", true);
  }

  if (!itemCanUsedInWorld) inventory.dialogBox.open(text, true);
};
