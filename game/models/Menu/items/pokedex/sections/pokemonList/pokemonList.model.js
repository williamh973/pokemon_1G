import { POKEDEX_DATABASE } from "../../../../../../logic/gameplay/pokemon/pokemon.database.js";
import { drawBox } from "../../../../../../shareds/utils.js";
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
    this.databases = POKEDEX_DATABASE;
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.heightLine = 40;
    this.title = "SOMMAIRE";
    this.cursor = new Cursor();
    this.pokedexState = new PokedexState(this, true);
    this.pokemonDetail = new PokemonDetail(game);
  }

  checkPokedexState(context, positionX, positionY, pokemon, index) {
    this.pokedexState.see(pokemon.id);
    if (this.pokedexState.isSeen(pokemon.id)) {
      this.showPokemon(context, positionX, positionY, pokemon, index);
    } else this.hidePokemon(context, positionX, positionY, pokemon, index);
  }

  drawText(context) {
    context.font = `27px PixelOperator `;
    context.fillStyle = "black";
    context.textBaseline = "top";

    this.databases.forEach((pokemon, index) => {
      const paddingX = 30;
      const paddingY = 50;
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * this.heightLine;

      this.checkPokedexState(context, positionX, positionY, pokemon, index);
    });

    context.fillStyle = "white";
    context.fillRect(1, 1, this.width - 10, 40);
    context.fillStyle = "black";
    context.font = `27px PixelOperator `;
    context.fillText(this.title, 50, 0, this.width, 50);
  }

  showPokemon(context, positionX, positionY, pokemon, index) {
    context.font = `23px PixelOperator`;
    context.fillText(
      pokemon.id,
      positionX,
      positionY,
      this.width,
      this.heightLine * index
    );

    context.fillText(
      pokemon.name,
      positionX + 50,
      positionY,
      this.width,
      this.heightLine * index
    );
  }

  hidePokemon(context, positionX, positionY, pokemon, index) {
    context.fillText(
      pokemon.id,
      positionX,
      positionY,
      this.width,
      this.heightLine * index
    );
    context.fillText(
      "- - - - - - -",
      positionX + 50,
      positionY,
      this.width,
      this.heightLine * index
    );
  }

  handleScroll() {
    if (this.currentIndex >= 7)
      this.position.y = -(this.currentIndex - (7 - 1)) * this.lineHeight;
    else this.position.y = 0;
  }

  updateCursorWhenPokemonSelected(context) {
    const cursorY =
      this.position.y +
      this.heightLine +
      this.currentIndex * this.lineHeight +
      15;

    let hasFocusedCursor = false;

    this.isPokemonSelected
      ? (hasFocusedCursor = true)
      : (hasFocusedCursor = false);

    if (this.isPokemonSelected) {
      this.cursor.update(
        context,
        this.position.x + 5,
        cursorY,
        hasFocusedCursor
      );
    } else {
      this.cursor.update(
        context,
        this.position.x + 5,
        cursorY,
        hasFocusedCursor
      );
    }

    const pokemonFounded = this.databases[this.currentIndex];
    this.pokemonDetail.pokemon = pokemonFounded;
  }

  draw(context) {
    if (!this.isOpen) return;

    drawBox(context, 0, 0, this.width, this.height, "black", "white");
    this.drawText(context);

    this.updateCursorWhenPokemonSelected(context);
  }

  update(context) {
    this.draw(context);
    this.handleScroll();
  }
}
