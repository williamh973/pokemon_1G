import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonMoveSlot } from "../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";
import { BattleMoveInfo } from "./BattleMoveInfos/BattleMoveInfos.model.js";

export class BattleMovesMenu extends Menu {
  constructor(game) {
    super(game);

    this.currentPlayerPokemon = null;
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = 70;
    this.position = {
      x: 0,
      y: this.canvas.height - this.height,
    };
    this.items = [];
    this.selectedMoveData = null;
    this.slots = [
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
    ];

    this.battleMoveInfo = new BattleMoveInfo();
  }

  getSlotConfig(index) {
    const col = index % 2;
    const row = Math.floor(index / 2);

    return {
      positionX: this.position.x + 3 + col * 115,
      positionY: this.position.y + 7 + row * 33,
      width: 110,
      height: 28,
    };
  }

  setItems() {
    this.items = [];

    this.currentPlayerPokemon?.moves.forEach((move, index) => {
      const slot = this.slots[index];

      slot.config = this.getSlotConfig(index);
      slot.id = `MOVE_SLOT`;

      slot.setMove(move);
      this.items.push(slot);
    });
  }

  open() {
    this.setItems();

    super.open();
  }

  close() {
    this.items = [];
    super.close();
    this.game.battleManager.openBattleMenu();
  }

  draw(context) {
    this.items.forEach((item, index) => {
      item.isHovered = index === this.currentIndex;

      const { positionX, positionY, width, height } = item.config;

      drawBox(
        context,
        positionX,
        positionY,
        width,
        height,
        item.isHovered ? "red" : "rgba(120, 170, 220, 0.35)",
        "rgba(30, 60, 100, 1)"
      );
    });
  }

  openItem() {
    this.selectedMoveData = this.items[this.currentIndex].content.move;

    const moveSlotId = this.items[this.currentIndex].id;
    this.game.handleMenuSelection(moveSlotId, this);
  }

  updateSelectedMove() {
    const selectedSlot = this.items[this.currentIndex];

    if (!selectedSlot) return;

    this.battleMoveInfo.setMove(selectedSlot.content.move);
  }

  update(context, action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);

    for (const move of this.items) move.update(context);

    this.updateSelectedMove();
    this.battleMoveInfo.update(context);

    switch (action) {
      case INPUT_STATE.ACTION:
        this.openItem();
        break;
      case INPUT_STATE.RIGHT:
        if (this.currentIndex % 2 === 0) this.currentIndex++;
        break;

      case INPUT_STATE.LEFT:
        if (this.currentIndex % 2 === 1) this.currentIndex--;
        break;

      case INPUT_STATE.DOWN:
        if (this.currentIndex < 2) this.currentIndex += 2;
        break;

      case INPUT_STATE.UP:
        if (this.currentIndex >= 2) this.currentIndex -= 2;
        break;
      case INPUT_STATE.ESCAPE:
        this.close();
        break;
    }
  }
}
