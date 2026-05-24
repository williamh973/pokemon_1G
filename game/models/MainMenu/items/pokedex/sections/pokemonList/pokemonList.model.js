import { POKEDEX_DATABASE } from "../../../../../../shareds/pokedex/pokedex.database.js";
import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";
import { Cursor } from "../../../../../Cursor/Cursor.model.js";
import { PokedexState } from "../pokedexState/pokedexState.model.js";
import { PokemonDetail } from "../pokemonDetail/pokemonDetail.model.js";

export class PokemonList {
  constructor(game) {
    this.game = game;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = game.canvas.width / 1.35;
    this.height = game.canvas.height;
    this.isOpen = false;
    this.hasFocus = false;
    this.isPokemonSelected = false;
    this.selectedPokemon = {};
    this.databases = POKEDEX_DATABASE;
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.title = "SOMMAIRE";
    this.cursor = new Cursor();
    this.pokedexState = new PokedexState(this);
    this.pokemonDetail = new PokemonDetail(this, game);
  }

  closePokemonDetail() {
    this.pokemonDetail.isOpen = false;
  }

  open() {
    this.isOpen = true;
    this.isPokemonSelected = false;
    this.cursor.state = "idle";
    this.cursor.isVisible = true;
    this.hasFocus = true;
    this.openPokedexState();
    this.closePokemonDetail();
  }

  openPokedexState() {
    this.pokedexState.open();
  }

  closePokedexState() {
    this.pokedexState.close();
  }

  close() {
    this.closePokedexState();
    this.hasFocus = false;
    this.isPokemonSelected = false;
    this.isOpen = false;
  }

  checkPokedexState(context, positionX, positionY, pokemon) {
    this.pokedexState.see(pokemon.id);
    if (this.pokedexState.isSeen(pokemon.id)) {
      this.showPokemon(context, positionX, positionY, pokemon);
    } else this.hidePokemon(context, positionX, positionY, pokemon);
  }

  drawPokemonList(context) {
    textParams(context, "27");

    this.databases.forEach((pokemon, index) => {
      const paddingX = 30;
      const paddingY = 50;
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * 40;

      this.checkPokedexState(context, positionX, positionY, pokemon);
    });

    context.fillStyle = "white";
    context.fillRect(1, 1, this.width - 10, 40);

    drawText(context, this.title, 50, 0);
  }

  showPokemon(context, positionX, positionY, pokemon) {
    textParams(context, "23");
    drawText(context, pokemon.no, positionX, positionY);
    drawText(context, pokemon.name, positionX + 50, positionY);
  }

  hidePokemon(context, positionX, positionY, pokemon) {
    drawText(context, pokemon.id, positionX, positionY);
    drawText(context, "- - - - - - -", positionX + 50, positionY);
  }

  handleScroll() {
    if (this.currentIndex >= 7)
      this.position.y = -(this.currentIndex - (7 - 1)) * this.lineHeight;
    else this.position.y = 0;
  }

  updateCursorWhenPokemonSelected(context) {
    const cursorY =
      this.position.y + 40 + this.currentIndex * this.lineHeight + 15;

    let hasFocusedCursor = false;

    this.isPokemonSelected
      ? (hasFocusedCursor = true)
      : (hasFocusedCursor = false);

    if (this.isPokemonSelected)
      this.cursor.update(
        context,
        this.position.x + 5,
        cursorY,
        hasFocusedCursor
      );
    else
      this.cursor.update(
        context,
        this.position.x + 5,
        cursorY,
        hasFocusedCursor
      );

    const pokemonFounded = this.databases[this.currentIndex];
    this.selectedPokemon = pokemonFounded;
    this.pokemonDetail.pokemon = pokemonFounded;
  }

  draw(context) {
    drawBox(context, 0, 0, this.width, this.height, "black", "white");
    this.drawPokemonList(context);
    this.updateCursorWhenPokemonSelected(context);
  }

  selectPokemonFromPokemonList() {
    if (
      this.pokedexState.isSeen(this.selectedPokemon.id) &&
      !this.isPokemonSelected
    ) {
      this.isPokemonSelected = true;
      this.hasFocus = false;
      this.cursor.state = this.cursor.state.focused;
      this.game.player.pokedex.pokedexCharac.cursor.isVisible = true;
      this.game.player.pokedex.pokedexCharac.hasFocus = true;
    }
  }

  update(context, action) {
    this.draw(context);
    if (!this.hasFocus) return;
    this.handleScroll();

    switch (action) {
      case "UP":
        if (!this.isPokemonSelected && this.currentIndex > 0)
          this.currentIndex--;
        break;

      case "DOWN":
        if (
          !this.isPokemonSelected &&
          this.currentIndex < this.databases.length - 1
        )
          this.currentIndex++;
        break;

      case "ACTION":
        this.selectPokemonFromPokemonList();
        break;
    }
  }
}
