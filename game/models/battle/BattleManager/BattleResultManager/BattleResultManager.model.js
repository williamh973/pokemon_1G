import { EXP_STATES } from "../../../../logic/gameplay/battleManager/experience/expStates.states.js";
import { resetTeamStatStages } from "../../../../logic/gameplay/battleManager/turnManager/statStages/resetStatStages.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { levelUpProcess } from "../../../../logic/gameplay/pokemon/levelUp/levelUpProcess.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { calculateExpGain } from "../experiences/calculateExpGain.gameplay.js";

export class BattleResultManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.battlePhaseManager = this.battleManager.phaseManager;

    this.isKoProcessed = false;
    this.isLevelUpProcessed = false;

    this.expState = EXP_STATES.IDLE;

    this.gainedExp = null;

    this.targetExp = null;
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

    this.gainedExp = 300; //calculateExpGain(fainted);
  }

  hasLevelUp(pokemon) {
    return pokemon.exp >= pokemon.nextLevelExp;
  }

  startExpGain() {
    this.expState = EXP_STATES.ANIMATING;

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

  endBattle() {
    resetTeamStatStages(this.battleManager.game.player.party);

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

    switch (this.expState) {
      case EXP_STATES.ANIMATING:
        if (this.battleManager.isExpAnimationFinished(activePokemon)) {
          if (this.hasLevelUp(activePokemon)) {
            this.isLevelUpProcessed = false;
            this.expState = EXP_STATES.LEVEL_UP;
          } else this.expState = EXP_STATES.FINISHED;
        }
        break;

      case EXP_STATES.LEVEL_UP:
        if (!this.isLevelUpProcessed) {
          this.isLevelUpProcessed = true;

          console.log("AVANT LEVEL UP", {
            level: activePokemon.level,
            exp: activePokemon.exp,
            nextLevelExp: activePokemon.nextLevelExp,
          });

          const levelUpResult = levelUpProcess(null, activePokemon, false);

          console.log("APRÈS LEVEL UP", {
            level: activePokemon.level,
            exp: activePokemon.exp,
            nextLevelExp: activePokemon.nextLevelExp,
            hasLevelUp: this.hasLevelUp(activePokemon),
          });

          if (levelUpResult.success && levelUpResult.text) {
            this.battleManager.openDialogBox(levelUpResult.text);
          }
        }

        if (action === INPUT_STATE.ACTION) {
          const animationTarget = this.hasLevelUp(activePokemon)
            ? activePokemon.nextLevelExp
            : activePokemon.exp;

          this.setExpBarTarget(activePokemon, animationTarget);

          this.expState = EXP_STATES.ANIMATING;
        }
        break;

      default:
        break;
    }
  }
}
