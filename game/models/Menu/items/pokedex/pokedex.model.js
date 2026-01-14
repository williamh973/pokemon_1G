import { drawBox } from "../../../../shareds/utils.js";
import { PokedexCharacteristic } from "./sections/pokedexCharact/pokedexCharact.model.js";
import { PokemonList } from "./sections/pokemonList/pokemonList.model.js";

export class Pokedex {
  constructor(game, isOpen) {
    this.game = game;
    this.canvas = game.canvas;
    this.name = "POKEDEX";
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = isOpen;
    this.pokemonList = new PokemonList(this.game, true);
    this.pokedexCharac = new PokedexCharacteristic(
      this.game,
      this.pokemonList,
      true
    );
  }

  draw(context) {
    context.fillStyle = "white";
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
