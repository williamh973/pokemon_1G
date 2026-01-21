import { drawBox } from "../../shareds/utils.js";

export class DialogBox {
  constructor(game) {
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
    this.pokedexDetailPage =
      this.game.currentScreen?.pokemonList?.pokemonDetail;
  }

  checkBoxHeight() {
    switch (this.pokedexDetailPage.isOpen) {
      case true:
        this.height = 121;
        break;
      case false:
        this.height = 65;
        break;
      default:
        break;
    }
    this.position.y = this.game.canvas.height - this.height;
  }

  updateMaxLineForPokedexDetailPage() {
    this.pokedexDetailPage && this.pokedexDetailPage.isOpen
      ? (this.maxLines = 4)
      : (this.maxLines = 2);
  }

  createPages(text) {
    const pages = [];
    const lines = text.split("\n");

    this.updateMaxLineForPokedexDetailPage();

    for (let i = 0; i < lines.length; i += this.maxLines) {
      pages.push(lines.slice(i, i + this.maxLines));
    }
    return pages;
  }

  draw(context) {
    if (this.pokedexDetailPage && this.pokedexDetailPage.isOpen)
      this.checkBoxHeight();

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
    const page = this.pages[this.currentPageIndex];
    const padding = 9;
    context.font = `26px PixelOperator `;
    context.fillStyle = "black";
    context.textBaseline = "top";

    page.forEach((line, index) => {
      context.fillText(
        line,
        this.position.x + padding,
        this.position.y + padding + index * 26
      );
    });
  }

  open(text) {
    this.text = text;
    this.currentPageIndex = 0;
    this.isOpen = true;
    this.pages = this.createPages(this.text);
  }

  close() {
    this.isOpen = false;
    this.text = null;
    this.pages = [];
  }

  hasNextPage() {
    return this.currentPageIndex < this.pages.length - 1;
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (action !== "ACTION") return;
    if (this.hasNextPage()) this.currentPageIndex++;
    else this.game.closeDialogBox();
  }
}
