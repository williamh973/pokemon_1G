import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";

export class PokedexState {
  constructor(pokemonList) {
    this.position = {
      x: pokemonList.position.x + pokemonList.width,
      y: 0,
    };
    this.isOpen = false;
    this.width = 82;
    this.height = 130;
    this.seen = new Set();
    this.caught = new Set();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  // lorsqu'un combat prend fin, j'appele cette méthode
  see(id) {
    this.seen.add(id);
  }

  catch(id) {
    this.seen.add(id);
    this.caught.add(id);
  }

  isSeen(id) {
    return this.seen.has(id);
  }

  isCaught(id) {
    return this.caught.has(id);
  }

  drawLabels(context, positionX) {
    textParams(context, `27`);
    drawText(context, "VU", positionX, 10);
    drawText(context, "PRIS", positionX - 10, 70);
  }

  drawCounts(context, positionX) {
    textParams(context, `23`);
    drawText(context, this.seen.size, positionX + 5, 35);
    drawText(context, this.caught.size, positionX + 5, 95);
  }

  draw(context) {
    if (!this.isOpen) return;
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );
    const positionX = this.position.x + this.width / 2.5;

    this.drawLabels(context, positionX);
    this.drawCounts(context, positionX);
  }

  update(context) {
    this.draw(context);
  }
}
