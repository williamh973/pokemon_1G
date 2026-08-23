import { AI_TYPE } from "../../../../logic/gameplay/battleManager/AI/AI.type.js";

export class AI {
  constructor() {
    this.type = AI_TYPE.wild;
  }

  chooseMove(wildPokemon) {
    const availableMoves = wildPokemon.moves.filter(
      (move) => move.enabled && move.currentPP > 0
    );

    if (availableMoves.length === 0) {
      // Struggle plus tard
      return null;
    }

    const random = Math.floor(Math.random() * availableMoves.length);

    return availableMoves[random];
  }
}
