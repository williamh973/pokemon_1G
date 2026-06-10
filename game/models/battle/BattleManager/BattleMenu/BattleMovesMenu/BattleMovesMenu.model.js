import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonMoveSlot } from "../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";

export class BattleMovesMenu extends Menu {
  constructor(game) {
    super(game);

    this.currentPlayerPokemon = this.game.battleManager.currentPlayerPokemon;

    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2;
    this.height = this.canvas.height / 2;
    this.position = {
      x: this.canvas.width - this.width,
      y: this.canvas.height - this.height,
    };
    this.lineHeight = 40;
    this.items = [];

    this.setItems();
  }

  setItems() {
    this.currentPlayerPokemon.moves.forEach((move, index) => {
      let slot = new PokemonMoveSlot({
        positionX: this.position.x + 25,
        positionY: this.position.y + 10 + this.lineHeight * index,
        width: this.width - 25,
        height: 40,
      });
      slot.setMove(move);
      this.items.push(slot);
    });
  }

  open() {
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

    this.showCursor(context);
  }

  update(context, action) {
    super.update(action);

    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);

    for (const move of this.items) move.update(context);

    // switch (action) {
    //   case "ACTION":
    //     this.openItem();
    //     break;

    //   case "PLAYER_MENU":
    //     this.game.closePlayerMenu();
    //     break;
    // }
  }
}
