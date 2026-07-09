import { levelUp } from "../../../../../logic/gameplay/pokemon/levelUp/levelUp.gameplay.js";
import { checkLearnset } from "../../../../../shareds/utils/pokemon/learnsets/learnset.utils.js";

export class PartyPhaseManager {
  constructor(party, game, usedItem, selectedSlot) {
    this.party = party;
    this.game = game;
    this.selectedSlot = selectedSlot;
    this.selectedPokemon = selectedSlot.content;
    this.currentPhase = usedItem.effect;
    this.previousPhase = this.currentPhase;
  }

  setPhase(phase) {
    this.previousPhase = this.currentPhase;
    this.currentPhase = phase;
  }

  begin() {
    switch (this.currentPhase) {
      case "LEVEL_UP":
        const levelUpResult = levelUp(this.selectedSlot, this.selectedPokemon);

        return {
          stats: levelUpResult,
          dialog: levelUpResult.text,
        };
    }
  }

  next() {
    switch (this.currentPhase) {
      case "LEVEL_UP":
        this.setPhase("CHECK_LEARNSET");

        return {
          closeDialog: true,
          closeStats: true,
          nextPhase: true,
        };

      case "CHECK_LEARNSET":
        const learnset = checkLearnset(this.selectedPokemon);

        if (learnset.noLearset) {
          this.setPhase("END");
          return this.next();
        }

        if (learnset.success) {
          console.log("apprend une capacité");
          this.setPhase("END");
          return {
            dialog: learnset.text,
          };
        }

        if (learnset.text)
          return {
            dialog: learnset.text,
          };

      case "LEARN_MOVE":
        // ...
        break;

      case "END":
        console.log("END PHASE");
        return {
          finished: true,
          closeDialog: true,
        };
    }
  }
}
