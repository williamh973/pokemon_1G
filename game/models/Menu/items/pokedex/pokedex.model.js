import { drawBox } from "../../../../shareds/utils.js";
import { PokedexCharacteristic } from "./pokedexCharact/pokedexCharact.model.js";
import { PokemonDetail } from "./pokemonDetail/pokemonDetail.model.js";
import { PokemonList } from "./pokemonList/pokemonList.model.js";

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
    this.pokemonList = new PokemonList(this.canvas, true);
    this.pokedexCharac = new PokedexCharacteristic(
      this.game,
      this.pokemonList,
      true
    );
    this.pokemonDetail = new PokemonDetail(this.canvas, false);
  }

  draw(context) {
    context.fillStyle = "white";
    drawBox(context, this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
