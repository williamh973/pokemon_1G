import { Move } from "../../pokemon/move/move.model.js";
import { Slot } from "../Slot.model.js";

export class PokemonMoveSlot extends Slot {
  constructor(config, id = null) {
    super(config);
    this.id = id;
    this.config = config;
    this.content = null;
  }

  setMove(move) {
    this.content = new Move(move, this.config);
  }

  update(context) {
    super.update(context);
    if (this.content) this.content.update(context);
  }
}
