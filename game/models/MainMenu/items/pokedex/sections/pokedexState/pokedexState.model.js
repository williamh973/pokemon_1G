import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";

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

  see(id) {
    // lorsqu'un combat prend fin, j'appele cette méthode
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
    context.font = `27px PixelOperator`;
    context.fillText("VU", positionX, 10);
    context.fillText("PRIS", positionX - 10, 70);
  }

  drawCounts(context, positionX) {
    context.font = `23px PixelOperator`;
    context.fillText(this.seen.size, positionX + 5, 35);
    context.fillText(this.caught.size, positionX + 5, 95);
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
    context.fillStyle = "black";

    this.drawLabels(context, positionX);
    this.drawCounts(context, positionX);

    context.font = `23px PixelOperator`;
    context.fillText(this.seen.size, positionX + 5, 35);
    context.fillText(this.caught.size, positionX + 5, 95);
  }

  update(context) {
    this.draw(context);
  }
}
