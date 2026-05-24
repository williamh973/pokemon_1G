import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { drawText } from "../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";

export class DialogBox {
  constructor(game, ignoreNextAction = false) {
    this.game = game;
    this.width = this.game.canvas.width;
    this.height = 65;
    this.position = {
      x: 0,
      y: this.game.canvas.height - this.height,
    };
    this.text = null;
    this.maxLines = 2;
    this.currentPageIndex = 0;
    this.isOpen = false;
    this.hasCurrentPageRead = false;
    this.ignoreNextAction = ignoreNextAction;
    this.hasFocus = false;
  }

  createPages(text) {
    const pages = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i += this.maxLines) {
      pages.push(lines.slice(i, i + this.maxLines));
    }
    return pages;
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
    if (this.text) this.drawText(context);
  }

  drawText(context) {
    textParams(context, "26");

    const page = this.pages[this.currentPageIndex];
    page.forEach((line, index) => {
      drawText(
        context,
        line,
        this.position.x + 9,
        this.position.y + 9 + index * 26
      );
    });
  }

  open(text, ignoreNextAction = false) {
    this.text = text;
    this.currentPageIndex = 0;
    this.isOpen = true;
    this.ignoreNextAction = ignoreNextAction;
    this.hasFocus = true;
    this.pages = this.createPages(this.text);
  }

  close() {
    this.isOpen = false;
    this.text = null;
    this.pages = [];
    this.hasFocus = false;
  }

  hasNextPage() {
    return this.currentPageIndex < this.pages.length - 1;
  }

  noMorePage() {
    return "END_DIALOG";
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    if (!this.hasFocus || action !== "ACTION") return;

    if (this.ignoreNextAction) {
      this.ignoreNextAction = false;
      return;
    }

    if (this.hasNextPage()) this.currentPageIndex++;
    else return this.noMorePage();
  }
}
