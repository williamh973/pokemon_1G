import { pokemonList } from "./pokemonList/pokemonList.model.js";

export class Pokedex {
  constructor(canvas, isOpen) {
    this.name = "POKEDEX";
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width;
    this.height = canvas.height;
    this.isOpen = isOpen;
    this.pokemonList = new pokemonList(canvas, true);
  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
