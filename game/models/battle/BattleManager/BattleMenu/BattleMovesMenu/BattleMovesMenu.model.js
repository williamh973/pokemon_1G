import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonMoveSlot } from "../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";

export class BattleMovesMenu extends Menu {
  constructor(game) {
    super(game);

    this.currentPlayerPokemon = null;
    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2;
    this.height = this.canvas.height / 2;
    this.position = {
      x: this.canvas.width - this.width,
      y: this.canvas.height - this.height,
    };
    this.lineHeight = 40;
    this.items = [];
    this.selectedMoveData = null;
  }

  setItems() {
    this.currentPlayerPokemon?.moves.forEach((move, index) => {
      let slot = new PokemonMoveSlot(
        {
          positionX: this.position.x + 25,
          positionY: this.position.y + 10 + this.lineHeight * index,
          width: this.width - 25,
          height: 40,
        },
        `MOVE_SLOT`
      );
      slot.setMove(move);
      this.items.push(slot);
    });
  }

  open() {
    this.setItems();
    super.open();
  }

  close() {
    super.close();
    this.game.battleManager.openBattleMenu();
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

  openItem() {
    this.selectedMoveData = this.items[this.currentIndex].content.move;

    const moveSlotId = this.items[this.currentIndex].id;
    this.game.handleMenuSelection(moveSlotId, this);
  }

  update(context, action) {
    super.update(action);

    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);

    for (const move of this.items) move.update(context);

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.close();
        break;
    }
  }
}
