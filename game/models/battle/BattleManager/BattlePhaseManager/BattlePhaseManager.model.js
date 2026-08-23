import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
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
    // console.log(this.currentPhase);
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
        if (this.previousPhase === BATTLE_PHASES.PLAYER_THROW_POKEBALL) {
          sequence.playerThrowSequence.isFinished = true;
          const pokemon = this.battleManager.currentPlayerPokemon; //this.battleManager.currentPlayerPokemon ou wildPokemon ou this.battleManager.currentTrainerPokemon
          const key = "back";
          sequence.startPokemonAppearsSequence(pokemon, key);
        }
        break;

      case BATTLE_PHASES.BATTLE_MENU:
        this.battleManager.isUseItem = false;
        this.battleManager.usedItem = null;
        sequence.battleCatchSequence = null;

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.whatShouldPokemonDo(
            this.battleManager.currentPlayerPokemon.name
          )
        );

        this.battleManager.battleMovesMenu.close();
        this.battleManager.openBattleMenu();
        break;

      case BATTLE_PHASES.CATCH_POKEMON:
        const BALL = this.battleManager.usedItem;
        sequence.initBattleCatchSequence(BALL);
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerUseBall(
            this.battleManager.game.player.nickname,
            this.battleManager.usedItem?.name
          )
        );
        break;

      case BATTLE_PHASES.SWITCH:
        let key = "front";
        if (this.battleManager.isAttemptSwitch) key = "back";

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.returnPokemon(
            this.battleManager.currentPlayerPokemon.name
          )
        );

        sequence.startBattleSwitchSequence(key);
        break;

      case BATTLE_PHASES.EXECUTE_TURN:
        this.battleManager.turnManager.startTurn(sequence);
        break;
    }
  }

  update(action) {
    const sequence = this.sequenceManager;

    switch (this.currentPhase) {
      case BATTLE_PHASES.INTRO:
        if (action === INPUT_STATE.ACTION && sequence.introSequence?.isFinished)
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
        if (
          this.battleManager.isUseItem &&
          this.battleManager.usedItem.effect === "CATCH"
        )
          this.setPhase(BATTLE_PHASES.CATCH_POKEMON);

        if (this.battleManager.isAttemptSwitch)
          this.setPhase(BATTLE_PHASES.SWITCH);
        break;

      case BATTLE_PHASES.CATCH_POKEMON:
        if (sequence.battleCatchSequence?.isFinished)
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        break;

      case BATTLE_PHASES.SWITCH:
        if (sequence.battleSwitchSequence?.isFinished) {
          this.battleManager.isAttemptSwitch = false;
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        }
        break;

      case BATTLE_PHASES.EXECUTE_TURN:
        if (this.battleManager.turnManager.isFinished) {
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
          break;
        }

        this.battleManager.turnManager.update(sequence);
        break;

      default:
        break;
    }
  }
}
