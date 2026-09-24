import { checkEvolution } from "../../../../../logic/gameplay/pokemon/evolutions/evolution.gameplay.js";
import { checkLearnset } from "../../../../../logic/gameplay/pokemon/learnsets/learnset.gameplay.js";
import { levelUpProcess } from "../../../../../logic/gameplay/pokemon/levelUp/levelUpProcess.gameplay.js";
import { EvolutionSequence } from "../sequences/PartyEvolutionSequence/EvolutionSequence.model.js";
import { PARTY_PHASES } from "./partyPhases.database.js";

export class PartyPhaseManager {
  constructor(party, game, usedItem, selectedSlot) {
    this.party = party;
    this.game = game;
    this.selectedSlot = selectedSlot;
    this.selectedPokemon = selectedSlot.content;
    this.currentPhase = usedItem.effect;
    this.previousPhase = this.currentPhase;

    this.evolutionSequence = new EvolutionSequence(
      this.game,
      this.selectedPokemon
    );
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

  next() {
    switch (this.currentPhase) {
      case PARTY_PHASES.LEVEL_UP:
        // console.log("LEVEL_UP");

        this.setPhase(PARTY_PHASES.CHECK_LEARNSET);

        return {
          closeDialog: true,
          closeStats: true,
          nextPhase: true,
        };

      case PARTY_PHASES.CHECK_LEARNSET:
        // console.log("CHECK_LEARNSET");
        const learnset = checkLearnset(this.selectedPokemon);

        if (learnset.noLearnset) {
          this.setPhase(PARTY_PHASES.CHECK_EVOLUTION);
          return this.next();
        }

        if (learnset.success) {
          this.setPhase(PARTY_PHASES.CHECK_EVOLUTION);
          return {
            dialog: learnset.text,
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
        this.game.screenManager.openEvolution();
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
