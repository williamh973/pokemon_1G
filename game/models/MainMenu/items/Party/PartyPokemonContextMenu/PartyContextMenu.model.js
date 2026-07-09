import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { TILES_SIZE } from "../../../../../shareds/utils/tile/tile.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonSummaryManager } from "./PokemonSummary/PokemonSummaryManager/PokemonSummaryManager.model.js";

export class PartyContextMenu extends Menu {
  constructor(game, pokemon, usedItem) {
    super(game);
    this.game = game;
    this.pokemon = pokemon;

    this.standartItemSet = [
      { id: "SUMMARY", name: "RESUME" },
      { id: "SWITCH_POKEMON", name: "ECHANGER" },
      { id: "ITEM", name: "OBJET" },
      { id: "RETOUR", name: "RETOUR" },
    ];

    this.objectItemSet = [
      { id: "USE_ITEM_TO_PARTY", name: "DONNER" },
      { id: "RETOUR", name: "RETOUR" },
    ];

    this.setItems(usedItem);

    this.width = game.canvas.width / 2 - TILES_SIZE;
    this.height = 30 * this.items.length + 15;
    this.position = {
      x: game.canvas.width - this.width,
      y: 0,
    };
    this.pokemonSummary = new PokemonSummaryManager(
      this.game,
      this.pokemon,
      () => this.reopenPartyMenu()
    );
  }

  setItems(usedItem) {
    usedItem
      ? (this.items = this.objectItemSet)
      : (this.items = this.standartItemSet);
  }

  reopenPartyMenu() {
    this.game.openParty();
    this.hasFocus = true;
    this.isOpen = true;
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

  close() {
    super.close();
  }

  update(context, action) {
    super.update(action);

    if (!this.isOpen) return;

    this.draw(context);

    this.pokemonSummary?.update(context, action);

    if (!this.hasFocus) return;

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.close();
        break;
    }
  }
}
