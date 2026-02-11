import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { Cursor } from "../Cursor/Cursor.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";

export class Inventory {
  constructor(game) {
    this.game = game;
    this.position = {
      x: 0,
      y: 0,
    };
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.categoryLabels = ["SOIN", "BALL", "RARE", "CT/CS"];
    this.CANCEL_ITEM = { id: "RETOUR", name: "RETOUR" };
    this.cares = [this.CANCEL_ITEM];
    this.balls = [this.CANCEL_ITEM];
    this.keys = [this.CANCEL_ITEM];
    this.cTcS = [this.CANCEL_ITEM];
    this.isOpen = false;
    this.hasFocus = false;
    this.lineHeight = 40;
    this.itemCurrentIndex = 0;
    this.catCurrentIndex = 0;
    this.baseY = 21;
    this.cursor = new Cursor();
    this.dialogBox = new DialogBox(this.game);
  }

  get categories() {
    switch (this.catCurrentIndex) {
      case 0:
        return this.cares;
      case 1:
        return this.balls;
      case 2:
        return this.keys;
      case 3:
        return this.cTcS;
      default:
        return [];
    }
  }

  async getCategoryList(category) {
    switch (category) {
      case "care":
        return this.cares;
      case "ball":
        return this.balls;
      case "key":
        return this.keys;
      case "CTCS":
        return this.cTcS;
      default:
        return [];
    }
  }

  removeCancelItem(list) {
    return list.filter((item) => item.id !== "RETOUR");
  }

  listSort(listFilter) {
    return listFilter.sort((a, b) => a.name.localeCompare(b.name));
  }

  resetList(list) {
    list.length = 0;
  }

  async add(item, category) {
    const list = await this.getCategoryList(category);
    const itemExist = list.find((i) => i.name === item.name);

    if (itemExist) itemExist.count += 1;
    else
      list.push({
        ...item,
        count: 1,
      });

    const cancelItem = list.find((item) => item.id === "RETOUR");

    const listFilter = this.removeCancelItem(list);
    const listSorted = this.listSort(listFilter);
    this.resetList(list);
    list.push(...listSorted, cancelItem);
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
    this.drawCategoryLabel(context);
    this.drawItemList(context);
    this.drawItemsCount(context);
    this.showCursor(context);
  }

  drawCategoryLabel(context) {
    const padding = 15;
    textParams(context, `25px PixelOperator `);

    context.fillText(
      this.categoryLabels[this.catCurrentIndex],
      this.position.x,
      this.position.y + padding
    );
  }

  drawItemList(context) {
    const padding = 40;
    this.categories.forEach((item, index) => {
      const positionX = this.position.x + padding;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(item.name, positionX, positionY);
    });
  }

  showCursor(context) {
    const cursorY =
      this.position.y + this.itemCurrentIndex * this.lineHeight + 45;
    this.cursor.update(context, this.position.x + 10, cursorY);
  }

  drawItemsCount(context) {
    const padding = 55;
    this.categories.forEach((item, index) => {
      if (!item.count) return;
      const positionX = this.width - 110;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(`x${item.count}`, positionX, positionY);
    });
  }

  openDialogBox() {
    const item = this.categories[this.itemCurrentIndex];
    item && item.desc
      ? this.dialogBox.open(item?.desc, true)
      : this.dialogBox.open("", true);
  }

  open() {
    this.isOpen = true;
    this.cursor.isVisible = true;
    this.hasFocus = true;
    this.openDialogBox();
  }

  close() {
    this.isOpen = false;
    this.cursor.isVisible = false;
    this.hasFocus = false;
  }

  useItem() {
    const itemId = this.categories[this.itemCurrentIndex].name;
    this.game.handleMenuSelection(itemId, this);
  }

  toQuit() {
    this.close();
    this.game.resetCurrentScreen();
    this.game.openMenu();
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    this.openDialogBox();
    if (this.dialogBox.isOpen)
      this.dialogBox.update(this.game.canvas.context, action);

    if (!this.isOpen || !this.hasFocus) return;

    switch (action) {
      case "UP":
        if (this.itemCurrentIndex > 0) this.itemCurrentIndex--;
        break;

      case "DOWN":
        if (this.itemCurrentIndex < this.categories.length - 1)
          this.itemCurrentIndex++;
        break;

      case "RIGHT":
        if (this.catCurrentIndex < this.categoryLabels.length - 1) {
          this.catCurrentIndex++;
          this.itemCurrentIndex = 0;
        }
        break;

      case "LEFT":
        if (this.catCurrentIndex > 0) {
          this.catCurrentIndex--;
          this.itemCurrentIndex = 0;
        }
        break;

      case "ACTION":
        this.useItem();
        break;

      case "MENU":
      case "CANCEL":
        this.toQuit();
        break;
    }
  }
}
