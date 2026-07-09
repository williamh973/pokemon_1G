import { BALL_CONFIG } from "../../../../../../render/config/item/ball/ball.config.js";
import { POKEDEX_DATABASE } from "../../../../../../shareds/pokedex/pokedex.database.js";
import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";
import { Menu } from "../../../../../Menu/Menu.model.js";
import { PokedexState } from "../pokedexState/pokedexState.model.js";
import { PokemonDetail } from "../pokemonDetail/pokemonDetail.model.js";

export class PokemonList extends Menu {
  constructor(game) {
    super(game);

    this.position = {
      x: 0,
      y: 0,
    };
    this.width = game.canvas.width / 1.35;
    this.height = game.canvas.height;
    this.isPokemonSelected = false;
    this.selectedPokemon = {};
    this.items = POKEDEX_DATABASE;
    this.lineHeight = 40;
    this.title = "SOMMAIRE";
    this.pokedexState = new PokedexState(this);
    this.pokemonDetail = new PokemonDetail(this, game);
  }

  closePokemonDetail() {
    this.pokemonDetail.isOpen = false;
  }

  open() {
    super.open();
    this.isPokemonSelected = false;
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
    this.isPokemonSelected = false;
    super.close();
  }

  checkPokedexState(context, positionX, positionY, pokemon) {
    // this.pokedexState.see(pokemon.id); // pour dev

    if (this.pokedexState.getSeen(pokemon.id)) {
      this.showPokemon(context, positionX, positionY, pokemon);
      if (this.pokedexState.getCaught(pokemon.id)) {
        this.showPokeball(context, positionX, positionY);
      }
    } else this.hidePokemon(context, positionX, positionY, pokemon);
  }

  drawPokemonList(context) {
    textParams(context, "27");

    this.items.forEach((pokemon, index) => {
      const paddingX = 30;
      const paddingY = 50;
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * 40;

      this.checkPokedexState(context, positionX, positionY, pokemon);
    });

    if (this.currentIndex < 7) drawText(context, this.title, 50, 0);
  }

  showPokemon(context, positionX, positionY, pokemon) {
    textParams(context, "23");
    drawText(context, pokemon.no, positionX, positionY);
    drawText(context, pokemon.name, positionX + 50, positionY);
  }

  hidePokemon(context, positionX, positionY, pokemon) {
    drawText(context, pokemon.no, positionX, positionY);
    drawText(context, "- - - - - - -", positionX + 50, positionY);
  }

  showPokeball(context, positionX, positionY) {
    const BALLS = BALL_CONFIG;
    context.drawImage(
      BALLS["POKEBALL"].image,
      positionX + 180,
      positionY + 5,
      BALLS.dimensions.width * BALLS.dimensions.scale,
      BALLS.dimensions.height * BALLS.dimensions.scale
    );
  }

  handleScroll() {
    if (this.currentIndex >= 7)
      this.position.y = -(this.currentIndex - (7 - 1)) * this.lineHeight;
    else this.position.y = 0;
  }

  updateCursorWhenPokemonSelected(context) {
    let hasFocusedCursor = false;

    this.isPokemonSelected
      ? (hasFocusedCursor = true)
      : (hasFocusedCursor = false);

    this.showCursor(context, 5, 55, hasFocusedCursor);

    const pokemonFounded = this.items[this.currentIndex];
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
      this.pokedexState.getSeen(this.selectedPokemon.id) &&
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
          this.currentIndex < this.items.length - 1
        )
          this.currentIndex++;
        break;

      case "ACTION":
        this.selectPokemonFromPokemonList();
        break;
    }
  }
}
