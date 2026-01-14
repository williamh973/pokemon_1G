import { game } from "../../../main.js";
import { drawBox } from "../../shareds/utils.js";

export class DialogBox {
  constructor(game, text, isOpen) {
    this.game = game;
    this.width = this.game.canvas.width;
    this.height = 65;
    this.position = {
      x: 0,
      y: this.game.canvas.height - this.height,
    };
    this.text = text;
    this.maxLines = 2;
    this.currentPageIndex = 0;
    this.isOpen = isOpen;
    this.pokedexDetailPage =
      this.game.currentScreen?.pokemonList?.pokemonDetail;
    this.pages = this.createPages(text);
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

  createPages(text) {
    const pages = [];
    const lines = text.split("\n");

    this.pokedexDetailPage.isOpen ? (this.maxLines = 4) : (this.maxLines = 2);

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
    this.drawText(context);
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

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      return;
    } else {
      this.isOpen = false;
      game.closeDialogBox();
    }
  }

  update(context) {
    if (!this.isOpen) return;

    this.draw(context);
  }
}
