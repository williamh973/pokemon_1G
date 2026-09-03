import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
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

      case BATTLE_PHASES.PLAYER_TRY_CATCH_POKEMON:
        const BALL = this.battleManager.usedItem;
        sequence.initBattleCatchSequence(BALL);
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerUseBall(
            this.battleManager.game.player.nickname,
            this.battleManager.usedItem?.name
          )
        );
        break;

      case BATTLE_PHASES.POKEMON_ESCAPED:
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonEscaped(
            this.battleManager.wildPokemon.name
          )
        );
        break;

      case BATTLE_PHASES.POKEMON_CAUGHT:
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonCaptured(
            this.battleManager.wildPokemon.name
          )
        );
        break;

      case BATTLE_PHASES.POKEMON_ADDED_TO_PARTY:
        const addedPokemonToPlayerParty =
          this.battleManager.game.player.party.addPokemonToFirstEmptySlot(
            this.battleManager.wildPokemon
          );

        if (addedPokemonToPlayerParty) {
          this.setPhase(BATTLE_PHASES.CHECK_POKEDEX);
        } else this.setPhase(BATTLE_PHASES.TRANSFER_POKEMON_TO_PC);
        break;

      case BATTLE_PHASES.CHECK_POKEDEX:
        const hasPokemonAddedToPokedexState =
          this.battleManager.game.player.pokedex.pokemonList.pokedexState.addCatch(
            this.battleManager.wildPokemon.id
          );

        if (hasPokemonAddedToPokedexState) {
          this.battleManager.openDialogBox(
            DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonAddedToPokedex(
              this.battleManager.wildPokemon.name
            )
          );
        } else this.setPhase(BATTLE_PHASES.END_BATTLE);
        break;

      case BATTLE_PHASES.TRANSFER_POKEMON_TO_PC:
        // TRANSFERT LOGIC
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonSentToPc(
            this.battleManager.wildPokemon.name
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

      case BATTLE_PHASES.DETERMINE_KO:
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonKO(
            this.battleManager.turnManager.koAction.fainted.name
          )
        );
        break;

      case BATTLE_PHASES.EXP_GAIN:
        const { active } = this.battleManager.turnManager.koAction;
        const wildPokemonXp = this.battleManager.wildPokemon.exp;

        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.gainExp(active.name, wildPokemonXp)
        );
        console.log(
          DIALOGS_DATABASE.BATTLE_DIALOGS.gainExp(active.name, wildPokemonXp)
        );
        break;

      case BATTLE_PHASES.END_BATTLE_OR_CONTINUE:
        const { fainted } = this.battleManager.turnManager.koAction;
        const availableSlot =
          this.battleManager.game.player.party.hasAvailablePokemon();

        if (fainted.trainerId) {
          if (availableSlot) {
            console.log("Le joueur a au moins un pokémon en forme.");
            this.setPhase(BATTLE_PHASES.CONTINUE);
          } else {
            console.log("Le joueur n'a plus de pokémon en forme.");
            this.setPhase(BATTLE_PHASES.PLAYER_LOST_BATTLE);
          }
        } else this.setPhase(BATTLE_PHASES.END_BATTLE);
        break;

      case BATTLE_PHASES.PLAYER_LOST_BATTLE:
        const player = this.battleManager.game.player;
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerLoseBattle(player.nickname)
        );
        break;

      case BATTLE_PHASES.PLAYER_ESCAPE:
        this.battleManager.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.playerEscape()
        );
        break;

      case BATTLE_PHASES.END_BATTLE:
        this.battleManager.resultManager.endBattle();
        console.log("end battle");
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
          this.setPhase(BATTLE_PHASES.PLAYER_TRY_CATCH_POKEMON);

        if (this.battleManager.isAttemptSwitch)
          this.setPhase(BATTLE_PHASES.SWITCH);

        if (this.battleManager.hasPlayerEscaped)
          this.setPhase(BATTLE_PHASES.PLAYER_ESCAPE);
        break;

      case BATTLE_PHASES.PLAYER_TRY_CATCH_POKEMON:
        if (sequence.battleCatchSequence?.hasCaptured) {
          this.setPhase(BATTLE_PHASES.POKEMON_CAUGHT);
          break;
        }

        if (sequence.battleCatchSequence?.hasEscaped) {
          this.setPhase(BATTLE_PHASES.POKEMON_ESCAPED);
          break;
        }

        if (sequence.battleCatchSequence?.isFinished) {
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        }
        break;

      case BATTLE_PHASES.POKEMON_ESCAPED:
        if (action === INPUT_STATE.ACTION)
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        break;

      case BATTLE_PHASES.POKEMON_CAUGHT:
        if (action === INPUT_STATE.ACTION)
          this.setPhase(BATTLE_PHASES.POKEMON_ADDED_TO_PARTY);
        break;

      case BATTLE_PHASES.CHECK_POKEDEX:
        if (action === INPUT_STATE.ACTION)
          this.setPhase(BATTLE_PHASES.END_BATTLE);
        break;

      case BATTLE_PHASES.TRANSFER_POKEMON_TO_PC:
        if (action === INPUT_STATE.ACTION)
          this.setPhase(BATTLE_PHASES.END_BATTLE);
        break;

      case BATTLE_PHASES.SWITCH:
        if (sequence.battleSwitchSequence?.isFinished) {
          this.battleManager.isAttemptSwitch = false;
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        }
        break;

      case BATTLE_PHASES.EXECUTE_TURN:
        this.battleManager.turnManager.update(sequence, action);

        if (this.battleManager.turnManager.state === TURN_STATES.DETERMINE_KO) {
          this.setPhase(BATTLE_PHASES.DETERMINE_KO);
          break;
        }

        if (this.battleManager.turnManager.isFinished)
          this.setPhase(BATTLE_PHASES.BATTLE_MENU);
        break;

      case BATTLE_PHASES.DETERMINE_KO:
        if (action === INPUT_STATE.ACTION) {
          this.sequenceManager.startPokemonFaintSequence();
          this.setPhase(BATTLE_PHASES.FAINT);
        }
        break;

      case BATTLE_PHASES.FAINT:
        if (this.sequenceManager.pokemonFaintSequence?.isFinished) {
          const hasTargetTrainerId =
            this.battleManager.turnManager.koAction.fainted.trainerId;

          if (hasTargetTrainerId)
            this.setPhase(BATTLE_PHASES.END_BATTLE_OR_CONTINUE);
          else this.setPhase(BATTLE_PHASES.EXP_GAIN);
        }
        break;

      case BATTLE_PHASES.EXP_GAIN:
        const resultManager = this.battleManager.resultManager;

        if (!resultManager.isExpGainStarted) {
          if (action === INPUT_STATE.ACTION) resultManager.startExpGain();
          break;
        }

        if (resultManager.isExpGainFinished)
          this.setPhase(BATTLE_PHASES.END_BATTLE_OR_CONTINUE);
        break;

      case BATTLE_PHASES.PLAYER_LOST_BATTLE:
        if (action === INPUT_STATE.ACTION)
          this.setPhase(BATTLE_PHASES.END_BATTLE);
        break;

      case BATTLE_PHASES.PLAYER_ESCAPE:
        if (action === INPUT_STATE.ACTION) {
          this.battleManager.game.player.pokedex.pokemonList.pokedexState.addSee(
            this.battleManager.wildPokemon.id
          );
          this.setPhase(BATTLE_PHASES.END_BATTLE);
        }
        break;

      default:
        break;
    }
  }
}
