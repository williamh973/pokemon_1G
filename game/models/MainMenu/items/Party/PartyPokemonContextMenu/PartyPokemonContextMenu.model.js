import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { TILES_SIZE } from "../../../../../shareds/utils/tile/tile.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonSummaryManager } from "./PokemonSummary/PokemonSummaryManager/PokemonSummaryManager.model.js";

export class PokemonContextMenu extends Menu {
  constructor(game, pokemon) {
    super(game);
    this.game = game;
    this.pokemon = pokemon;
    this.items = [
      { id: "SUMMARY", name: "RESUME" },
      { id: "SWITCH_POKEMON", name: "ECHANGER" },
      { id: "ITEM", name: "OBJET" },
      { id: "RETOUR", name: "RETOUR" },
    ];
    this.width = game.canvas.width / 2 - TILES_SIZE;
    this.height = 30 * this.items.length;
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

    const party = this.game.player.party;
    party.contextMenu = null;
    party.hasFocus = true;
  }

  update(context, action) {
    super.update(action);

    this.draw(context);

    if (this.game.dialogBox.isOpen) {
      const result = this.game.dialogBox.update(
        this.game.canvas.context,
        action
      );
      if (result === this.game.dialogBox.noMorePage()) {
        this.game.dialogBox.close();
        this.close();
      }
    }

    this.pokemonSummary?.update(context, action);

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.close();
        break;
    }
  }
}
