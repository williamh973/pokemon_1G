import { drawBox } from "../../../../shareds/utils.js";
import { PokedexCharacteristic } from "./sections/pokedexCharact/pokedexCharact.model.js";
import { PokemonList } from "./sections/pokemonList/pokemonList.model.js";

export class Pokedex {
  constructor(game) {
    this.game = game;
    this.name = "POKEDEX";
    this.canvas = this.game.canvas;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = true;
    this.pokemonList = new PokemonList(this.game);
    this.pokedexCharac = new PokedexCharacteristic(this.game, this.pokemonList);

    this.openSections();
  }

  openSections() {
    this.openPokemonList();
    this.openPokedexCharac();
  }

  openPokemonList() {
    this.pokemonList.isOpen = true;
    this.pokemonList.cursor.isVisible = true;
    this.pokemonList.hasFocus = true;
  }

  openPokedexCharac() {
    this.pokedexCharac.isOpen = true;
    this.pokedexCharac.cursor.isVisible = false;
    this.pokedexCharac.hasFocus = false;
  }

  close() {
    const dialogBox = this.game.dialogBox;
    if (this.isOpen) {
      if (dialogBox?.isOpen) this.game.closeDialogBox();

      this.isOpen =
        this.pokemonList.isOpen =
        this.pokedexCharac.isOpen =
        this.pokemonList.pokedexState.isOpen =
        this.pokemonList.pokemonDetail.isOpen =
          false;

      this.pokedexCharac.hasFocus = false;
      this.pokemonList.hasFocus = false;

      this.pokedexCharac.cursor.isVisible = false;
      this.pokemonList.cursor.isVisible = false;

      this.game.resetCurrentScreen();
      this.game.openMenu();
    }
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

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    switch (action) {
      case "CANCEL":
        this.game.closePokedex();
        break;

      default:
        break;
    }
  }
}
