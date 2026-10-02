import { BATTLE_RESULT_STATES } from "../../../../logic/gameplay/battleManager/resultManager/resultManager.states.js";
import { resetTeamVolatils } from "../../../../logic/gameplay/battleManager/turnManager/moves/volatiles/resetTeamVolatils.gameplay.js";
import { resetTeamStatStages } from "../../../../logic/gameplay/battleManager/turnManager/statStages/resetStatStages.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { checkEvolution } from "../../../../logic/gameplay/pokemon/evolutions/evolution.gameplay.js";
import {
  checkLearnset,
  replaceMoveDialog,
} from "../../../../logic/gameplay/pokemon/learnsets/learnset.gameplay.js";
import { replacePokemonMove } from "../../../../logic/gameplay/pokemon/learnsets/replaceMove.gameplay.js";
import { levelUpProcess } from "../../../../logic/gameplay/pokemon/levelUp/levelUpProcess.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { calculateExpGain } from "../experiences/calculateExpGain.gameplay.js";

export class BattleResultManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.battlePhaseManager = this.battleManager.phaseManager;

    this.isKoProcessed = false;
    this.isLevelUpProcessed = false;
    this.isEvolutionStarted = false;

    this.state = BATTLE_RESULT_STATES.IDLE;

    this.gainedExp = null;

    this.targetExp = null;

    this.replacedMove = null;
    this.moveToLearn = null;
  }

  checkPokemonKo() {
    const turnManager = this.battleManager.turnManager;

    if (turnManager.state !== TURN_STATES.DETERMINE_KO) return;
    if (this.isKoProcessed) return;

    const koAction = turnManager.koAction;

    if (!koAction) return;

    const koPokemon = koAction.fainted;

    if (koPokemon === this.battleManager.wildPokemon) this.isKoProcessed = true;

    if (koPokemon === this.battleManager.currentPlayerPokemon) {
      this.isKoProcessed = true;
      // Pokémon du joueur KO
      // → choisir un autre Pokémon
      // → ou défaite
    }
  }

  calculateExpGain() {
    const { fainted } = this.battleManager.turnManager.koAction;

    this.gainedExp = calculateExpGain(fainted);
  }

  hasLevelUp(pokemon) {
    return pokemon.exp >= pokemon.nextLevelExp;
  }

  startExpGain() {
    this.state = BATTLE_RESULT_STATES.ANIMATING;

    const { active } = this.battleManager.turnManager.koAction;

    this.targetExp = active.exp + this.gainedExp;

    active.exp = this.targetExp;

    const animationTarget = this.hasLevelUp(active)
      ? active.nextLevelExp
      : active.exp;

    this.setExpBarTarget(active, animationTarget);
  }

  setExpBarTarget(pokemon, targetExp) {
    const expBar = this.battleManager.battleRenderer.getPokemonExpBar(pokemon);

    expBar.setExp(targetExp);
  }

  resumeExpAfterEvolution() {
    const activePokemon = this.battleManager.turnManager.koAction?.active;

    if (!activePokemon) return;

    const animationTarget = this.hasLevelUp(activePokemon)
      ? activePokemon.nextLevelExp
      : activePokemon.exp;

    this.setExpBarTarget(activePokemon, animationTarget);

    this.state = BATTLE_RESULT_STATES.ANIMATING;
  }

  endBattle() {
    resetTeamStatStages(this.battleManager.game.player.party);
    resetTeamVolatils(this.battleManager.game.player.party);

    this.battleManager.game.transition.start(
      () => {
        this.battleManager.game.togglePause(false, true);
      },
      (done) => {
        this.battleManager.game.screenManager.close(GAME_STATES.WORLD);
        this.battleManager.battleMenu.resetCurrentIndex();
        this.battleManager.game.onBattleEnded();
        done();
      },
      () => {}
    );
  }

  update(action) {
    this.checkPokemonKo();

    const activePokemon = this.battleManager.turnManager.koAction?.active;
    // console.log("state :   ", this.state);

    switch (this.state) {
      case BATTLE_RESULT_STATES.ANIMATING:
        if (this.battleManager.isExpAnimationFinished(activePokemon)) {
          if (this.hasLevelUp(activePokemon)) {
            this.isLevelUpProcessed = false;
            this.state = BATTLE_RESULT_STATES.LEVEL_UP;
          } else this.state = BATTLE_RESULT_STATES.FINISHED;
        }
        break;

      case BATTLE_RESULT_STATES.LEVEL_UP:
        if (!this.isLevelUpProcessed) {
          this.isLevelUpProcessed = true;

          const selectedSlot = null;
          const resetExp = false;

          const levelUpResult = levelUpProcess(
            selectedSlot,
            activePokemon,
            resetExp
          );

          if (levelUpResult.success && levelUpResult.text) {
            this.battleManager.openDialogBox(levelUpResult.text); // Mew monte au niveau X !
            console.log(levelUpResult.text);
          }
        }

        this.state = BATTLE_RESULT_STATES.CHECK_LEARNSET;

        break;

      case BATTLE_RESULT_STATES.CHECK_LEARNSET:
        const learnsetResult = checkLearnset(activePokemon);

        if (learnsetResult.noLearnset) {
          if (action === INPUT_STATE.ACTION) {
            this.state = BATTLE_RESULT_STATES.CHECK_EVOLUTION;
          }
          break;
        }

        if (learnsetResult.learnedMove) {
          this.battleManager.openDialogBox(learnsetResult.text);
          console.log(learnsetResult.text); // Mew apprend XXX !

          if (action === INPUT_STATE.ACTION) {
            this.state = BATTLE_RESULT_STATES.CHECK_EVOLUTION;
          }
          break;
        }

        if (learnsetResult.wantsToLearn) {
          this.moveToLearn = learnsetResult.move;

          if (action === INPUT_STATE.ACTION) {
            this.battleManager.openDialogBox(learnsetResult.text); // Mew voudrait apprendre...
            this.state = BATTLE_RESULT_STATES.WANTS_TO_LEARN_DIALOG;
          }
          break;
        }
        break;

      case BATTLE_RESULT_STATES.WANTS_TO_LEARN_DIALOG:
        if (!this.battleManager.game.dialogBox.hasNextPage()) {
          this.state = BATTLE_RESULT_STATES.LEARN_MOVE;
          console.log(this.battleManager.game.dialogBox.noMorePage());
        }
        break;

      case BATTLE_RESULT_STATES.LEARN_MOVE:
        this.battleManager.openBattleLearnMoveMenu();
        break;

      case BATTLE_RESULT_STATES.REPLACE_MOVE_DIALOG:
        replacePokemonMove(activePokemon, this.replacedMove, this.moveToLearn);

        const replaceMoveResult = replaceMoveDialog(
          activePokemon,
          this.replacedMove,
          this.moveToLearn
        );

        if (action === INPUT_STATE.ACTION) {
          this.battleManager.openDialogBox(replaceMoveResult.text);
          this.state = BATTLE_RESULT_STATES.FINISH_REPLACE_MOVE_DIALOG;
        }
        break;

      case BATTLE_RESULT_STATES.FINISH_REPLACE_MOVE_DIALOG:
        if (!this.battleManager.game.dialogBox.hasNextPage()) {
          if (action === INPUT_STATE.ACTION) {
            this.state = BATTLE_RESULT_STATES.CHECK_EVOLUTION;
          }
        }
        break;

      case BATTLE_RESULT_STATES.CHECK_EVOLUTION:
        const evolution = checkEvolution(activePokemon);

        if (evolution.success) {
          this.battleManager.openDialogBox(evolution.text); // `Quoi ! Mew évolue !?`

          if (action === INPUT_STATE.ACTION) {
            this.state = BATTLE_RESULT_STATES.EVOLUTION;
          }
        }

        if (!evolution.success) {
          if (action === INPUT_STATE.ACTION) {
            console.log("Pas d'évolution, reprise de l'animation de la ExpBar");
            const animationTarget = this.hasLevelUp(activePokemon)
              ? activePokemon.nextLevelExp
              : activePokemon.exp;

            this.setExpBarTarget(activePokemon, animationTarget);

            this.state = BATTLE_RESULT_STATES.ANIMATING;
          }
        }
        break;

      case BATTLE_RESULT_STATES.EVOLUTION:
        if (this.isEvolutionStarted) break;

        this.isEvolutionStarted = true;
        this.battleManager.game.createEvolutionSequence(activePokemon); // j'ai bien la dialogBox qui s'affiche mais l'écran ne s'ouvre pas
        break;

      default:
        break;
    }
  }
}
