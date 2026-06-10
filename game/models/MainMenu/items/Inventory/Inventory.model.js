import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../shareds/utils/font/font.utils.js";
import {
  listSort,
  resetList,
} from "../../../../shareds/utils/list/list.utils.js";
import { DialogBox } from "../../../DialogBox/dialogBox.model.js";
import { Menu } from "../../../Menu/Menu.model.js";

export class Inventory extends Menu {
  constructor(game) {
    super(game);

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
    this.lineHeight = 40;
    this.itemCurrentIndex = 0;
    this.catCurrentIndex = 0;
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
    const listSorted = listSort(listFilter);
    resetList(list);
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
    textParams(context, "25");

    drawText(
      context,
      this.categoryLabels[this.catCurrentIndex],
      this.position.x,
      this.position.y + 15
    );
  }

  drawItemList(context) {
    this.categories.forEach((item, index) => {
      drawText(
        context,
        item.name,
        this.position.x + 40,
        this.position.y + 40 + index * this.lineHeight
      );
    });
  }

  showCursor(context) {
    const cursorY =
      this.position.y + this.itemCurrentIndex * this.lineHeight + 45;
    this.cursor.update(context, this.position.x + 10, cursorY);
  }

  drawItemsCount(context) {
    this.categories.forEach((item, index) => {
      if (!item.count) return;
      drawText(
        context,
        `x${item.count}`,
        this.width - 110,
        this.position.y + 55 + index * this.lineHeight
      );
    });
  }

  openDialogBox() {
    const item = this.categories[this.itemCurrentIndex];
    item && item.desc
      ? this.dialogBox.open(item?.desc, true)
      : this.dialogBox.open("", true);
  }

  open() {
    super.open();
    this.openDialogBox();
  }

  useItem() {
    const itemId = this.categories[this.itemCurrentIndex].name;
    this.game.handleMenuSelection(itemId, this);
  }

  update(context, action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);
    this.openDialogBox();

    if (this.dialogBox.isOpen)
      this.dialogBox.update(this.game.canvas.context, action);

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

      case GAME_STATES.PLAYER_MENU:
      case "ESCAPE":
        this.game.closeAndReturnFromSubMenu();
        break;
    }
  }
}
