import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonMoveSlot } from "../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";

export class BattleLearnMoveMenu extends Menu {
  constructor(game) {
    super(game);

    this.currentPokemon = null;
    this.moveToLearn = null;

    this.canvas = this.game.canvas;
    this.width = this.canvas.width / 2;
    this.height = this.canvas.height / 2;

    this.position = {
      x: this.canvas.width - this.width,
      y: this.canvas.height - this.height,
    };

    this.lineHeight = 40;
    this.items = [];

    this.slots = [
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
    ];
  }

  setItems() {
    this.currentPokemon?.moves.forEach((move, index) => {
      const slot = this.slots[index];

      const slotConfig = {
        positionX: this.position.x + 25,
        positionY: this.position.y + 10 + this.lineHeight * index,
        width: this.width - 25,
        height: 40,
      };

      slot.config = slotConfig;
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
  }
}
