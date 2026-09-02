import { PokemonMoveSlot } from "../../../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummaryMoves extends BasePokemonSummary {
  constructor(game, pokemon) {
    super(game, pokemon);
    this.pokemon = pokemon;
    this.moves = [];
    this.lineHeight = 45;
    this.setMoves();
  }

  setMoves() {
    this.pokemon.moves.forEach((move, index) => {
      let slot = new PokemonMoveSlot({
        positionX: this.position.x + 178,
        positionY: this.position.y + 30 + this.lineHeight * index,
        width: 150,
        height: 40,
      });
      slot.setMove(move);
      this.moves.push(slot);
    });
  }

  draw(context) {
    super.draw(context);
  }

  update(context, action) {
    super.update(context, action);

    for (const move of this.moves) move.update(context);
  }
}
