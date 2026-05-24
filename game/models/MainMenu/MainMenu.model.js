import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Menu } from "../Menu/Menu.model.js";

export class MainMenu extends Menu {
  constructor(game) {
    super(game);

    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2 - TILES_SIZE;
    this.position = {
      x: this.canvas.width - this.width,
      y: 0,
    };
    this.lineHeight = 40;
    this.initItems();
    this.updateHeight();
  }

  initItems() {
    const SAVE_DATA = this.game.save;

    if (SAVE_DATA?.mainMenu.items) this.items = SAVE_DATA.mainMenu.items;
    else
      this.items = [
        { id: "SAC", name: "SAC" },
        { id: "SACHA", name: "SACHA" },
        { id: "SAUVER", name: "SAUVER" },
        { id: "OPTIONS", name: "OPTIONS" },
        { id: "RETOUR", name: "RETOUR" },
      ];
  }

  updateHeight() {
    this.height = this.lineHeight * this.items.length;
  }

  addPokedexItem(player) {
    const pokedex = { id: "POKEDEX", name: "POKEDEX" };

    const foundedPokedex = this.items.find((item) => item.id === pokedex.id);

    if (player.gotPokedex && !foundedPokedex) this.items.splice(0, 0, pokedex);
  }

  addPokemonItem(player) {
    const pokemonItem = { id: "POKEMON", name: "POKEMON" };

    const isItemAlreadyExists = this.items.find(
      (item) => item.id === pokemonItem.id
    );

    const hasPlayerPokemon = player.party.slots.find(
      (slot) => slot.content !== null
    );

    if (hasPlayerPokemon && !isItemAlreadyExists) {
      this.items.splice(1, 0, pokemonItem);
    }
  }

  checkItems() {
    const PLAYER = this.game.player;

    this.addPokemonItem(PLAYER);
    this.addPokedexItem(PLAYER);

    this.updateHeight();
  }

  open() {
    this.checkItems();

    super.open();
  }

  draw(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );

    this.drawItems(context);

    this.showCursor(context);
  }

  update(context, action) {
    super.update(action);

    if (!this.isOpen) return;

    this.draw(context);

    switch (action) {
      case "ACTION":
        this.openItem();
        break;

      case "PLAYER_MENU":
        this.game.closePlayerMenu();
        break;
    }
  }
}
