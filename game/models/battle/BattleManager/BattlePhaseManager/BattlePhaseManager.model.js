import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
import { BATTLE_PHASES } from "./battlePhase.js";

export class BattlePhaseManager {
  constructor(battleManager, sequenceManager) {
    this.battleManager = battleManager;
    this.sequenceManager = sequenceManager;
    this.currentPhase = BATTLE_PHASES.INTRO;
    this.previousPhase = this.currentPhase;

    this.sequenceManager.startIntroSequence();
  }

  setPhase(phase) {
    this.previousPhase = this.currentPhase;
    this.currentPhase = phase;
    console.log(this.currentPhase);
    this.onEnterPhase(phase);
  }

  onEnterPhase(phase) {
    const sequence = this.sequenceManager;

    switch (phase) {
      case BATTLE_PHASES.PLAYER_THROW_POKEBALL:
        sequence.startPlayerThrowSequence();

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerSentOutPokemon(
            this.battleManager.currentPlayerPokemon.name
          )
        );
        break;

      case BATTLE_PHASES.POKEMON_APPEARS:
        sequence.playerThrowSequence.isFinished = true;
        sequence.startPokemonAppearsSequence();
        break;

      case BATTLE_PHASES.BATTLE_MENU:
        this.battleManager.isUseItem = false;
        this.battleManager.usedItem = null;

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.whatShouldPokemonDo(
            this.battleManager.currentPlayerPokemon.name
          )
        );
        this.battleManager.game.openBattleMenu();
        break;

      case BATTLE_PHASES.CATCH_POKEMON:
        const PLAYER = this.battleManager.game.player;

        sequence.startBattleCatchSequence(this.battleManager.usedItem);

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerUseBall(
            PLAYER.nickname,
            this.battleManager.usedItem.name
          )
        );
        break;
    }
  }

  update(action) {
    const sequence = this.sequenceManager;

    switch (this.currentPhase) {
      case BATTLE_PHASES.INTRO:
        if (action === "ACTION" && sequence.introSequence?.isFinished)
          this.setPhase(BATTLE_PHASES.PLAYER_THROW_POKEBALL);
        break;

      case BATTLE_PHASES.PLAYER_THROW_POKEBALL:
        if (
          sequence.playerThrowSequence.pokeball?.pokeballReleaseEffect
            ?.isFinished
        )
          this.setPhase(BATTLE_PHASES.POKEMON_APPEARS);
        break;

      case BATTLE_PHASES.POKEMON_APPEARS:
        if (sequence.pokemonAppearsSequence?.isFinished)
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        break;

      case BATTLE_PHASES.BATTLE_MENU:
        if (this.battleManager.isUseItem)
          this.setPhase(BATTLE_PHASES.CATCH_POKEMON);
        break;

      case BATTLE_PHASES.CATCH_POKEMON:
        if (sequence.battleCatchSequence?.isFinished)
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        break;
      default:
        break;
    }
  }
}
