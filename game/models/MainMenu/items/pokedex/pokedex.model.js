import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
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
    this.isOpen = false;
    this.pokemonList = new PokemonList(this.game);
    this.pokedexCharac = new PokedexCharacteristic(this.game, this.pokemonList);
  }

  open() {
    this.isOpen = true;
    this.openSections();
  }

  openSections() {
    this.openPokemonList();
    this.openPokedexCharac();
  }

  openPokemonList() {
    this.pokemonList.open();
  }

  openPokedexCharac() {
    this.pokedexCharac.open();
  }

  openMainMenu() {
    this.game.openMenu();
  }

  closeSections() {
    this.pokemonList.close();
    this.pokedexCharac.close();
  }

  close() {
    this.closeSections();
    this.resetCurrentScreen();
    this.openMainMenu();
    this.isOpen = false;
  }

  resetCurrentScreen() {
    this.game.resetCurrentScreen();
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

  updatePokedexState() {
    if (this.pokemonList.isOpen)
      this.pokemonList.pokedexState.update(this.game.canvas.context);
  }

  updatePokemonDetail(action) {
    if (
      this.pokemonList.isPokemonSelected &&
      this.pokemonList.pokemonDetail.isOpen
    ) {
      this.pokemonList.pokemonDetail.update(this.game.canvas.context, action);
      this.pokemonList.pokemonDetail.pokemonViewer?.update(
        this.game.canvas.context,
        null
      );
    }
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    switch (action) {
      case "ESCAPE":
        this.game.closeCurrentScreen();
        break;

      default:
        break;
    }

    if (this.pokemonList.hasFocus) {
      this.pokemonList.update(this.game.canvas.context, action);
      this.pokedexCharac.draw(this.game.canvas.context);
    } else if (this.pokedexCharac.hasFocus) {
      this.pokedexCharac.update(this.game.canvas.context, action);
      this.pokemonList.draw(this.game.canvas.context);
    }

    this.updatePokedexState();
    this.updatePokemonDetail(action);
  }
}
