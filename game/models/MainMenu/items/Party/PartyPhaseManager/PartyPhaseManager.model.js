import { checkEvolution } from "../../../../../logic/gameplay/pokemon/evolutions/evolution.gameplay.js";
import {
  checkLearnset,
  replaceMoveDialog,
} from "../../../../../logic/gameplay/pokemon/learnsets/learnset.gameplay.js";
import { replacePokemonMove } from "../../../../../logic/gameplay/pokemon/learnsets/replaceMove.gameplay.js";
import { levelUpProcess } from "../../../../../logic/gameplay/pokemon/levelUp/levelUpProcess.gameplay.js";
import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { PARTY_PHASES } from "./partyPhases.database.js";

export class PartyPhaseManager {
  constructor(party, game, usedItem, selectedSlot) {
    this.party = party;
    this.game = game;
    this.selectedSlot = selectedSlot;
    this.selectedPokemon = selectedSlot.content;
    this.currentPhase = usedItem.effect;
    this.previousPhase = this.currentPhase;
    this.replacedMove = null;
  }

  setPhase(phase) {
    this.previousPhase = this.currentPhase;
    this.currentPhase = phase;
  }

  begin() {
    switch (this.currentPhase) {
      case PARTY_PHASES.LEVEL_UP:
        const levelUpResult = levelUpProcess(
          this.selectedSlot,
          this.selectedPokemon
        );

        return {
          stats: levelUpResult,
          dialog: levelUpResult.text,
        };
    }
  }

  next(action) {
    switch (this.currentPhase) {
      case PARTY_PHASES.LEVEL_UP:
        // console.log("LEVEL_UP");

        this.setPhase(PARTY_PHASES.CHECK_LEARNSET);

        return {
          closeDialog: true,
          closeStats: true,
          nextPhase: true,
        };

      case PARTY_PHASES.CHECK_LEARNSET: {
        const learnsetResult = checkLearnset(this.selectedPokemon);

        if (learnsetResult.noLearnset) {
          this.setPhase(PARTY_PHASES.CHECK_EVOLUTION);
          return this.next(action);
        }

        if (learnsetResult.learnedMove) {
          this.setPhase(PARTY_PHASES.LEARNSET_DIALOG);

          return {
            dialog: learnsetResult.text,
          };
        }

        if (learnsetResult.wantsToLearn) {
          this.moveToLearn = learnsetResult.move;

          this.setPhase(PARTY_PHASES.WANTS_TO_LEARN_DIALOG);

          return {
            dialog: learnsetResult.text,
          };
        }

        break;
      }

      case PARTY_PHASES.LEARNSET_DIALOG:
        if (!this.game.dialogBox.hasNextPage()) {
          this.setPhase(PARTY_PHASES.CHECK_EVOLUTION);

          return {
            closeDialog: true,
            nextPhase: true,
          };
        }

        break;

      case PARTY_PHASES.WANTS_TO_LEARN_DIALOG:
        if (!this.game.dialogBox.hasNextPage()) {
          this.setPhase(PARTY_PHASES.LEARN_MOVE);

          return {
            closeDialog: true,
            nextPhase: true,
          };
        }

        break;

      case PARTY_PHASES.LEARN_MOVE:
        this.game.openLearnMoveMenu(this.selectedPokemon, this.moveToLearn);

        return {
          nextPhase: false,
        };

      case PARTY_PHASES.REPLACE_MOVE_DIALOG: {
        replacePokemonMove(
          this.selectedPokemon,
          this.replacedMove,
          this.moveToLearn
        );

        const replaceMoveResult = replaceMoveDialog(
          this.selectedPokemon,
          this.replacedMove,
          this.moveToLearn
        );

        this.setPhase(PARTY_PHASES.FINISH_REPLACE_MOVE_DIALOG);

        return {
          dialog: replaceMoveResult.text,
        };
      }

      case PARTY_PHASES.FINISH_REPLACE_MOVE_DIALOG:
        if (!this.game.dialogBox.hasNextPage()) {
          this.setPhase(PARTY_PHASES.CHECK_EVOLUTION);

          return {
            closeDialog: true,
            nextPhase: true,
          };
        }

        break;

      case PARTY_PHASES.CHECK_EVOLUTION:
        const evolution = checkEvolution(this.selectedPokemon);

        if (evolution.success) {
          this.setPhase(PARTY_PHASES.EVOLUTION);

          return {
            dialog: evolution.text,
            nextPhase: true,
          };
        }

        if (!evolution.success) {
          return {
            closeDialog: true, // pour fermer la dialogBox de monté de niveau
            finished: true,
          };
        }
        break;

      case PARTY_PHASES.EVOLUTION:
        this.game.createEvolutionSequence(this.selectedPokemon);
        return {
          finished: true,
          closeDialog: true,
        };

      case PARTY_PHASES.END:
        return {
          finished: true,
          closeDialog: true,
        };
    }
  }
}
