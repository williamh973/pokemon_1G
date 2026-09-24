import { EXP_STATES } from "../../../../logic/gameplay/battleManager/experience/expStates.states.js";
import { resetTeamStatStages } from "../../../../logic/gameplay/battleManager/turnManager/statStages/resetStatStages.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { checkEvolution } from "../../../../logic/gameplay/pokemon/evolutions/evolution.gameplay.js";
import { checkLearnset } from "../../../../logic/gameplay/pokemon/learnsets/learnset.gameplay.js";
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
    console.log("expState :   ", this.expState);

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

        this.expState = EXP_STATES.CHECK_LEARNSET;

        break;

      case EXP_STATES.CHECK_LEARNSET:
        const learnsetResult = checkLearnset(activePokemon);

        if (learnsetResult.noLearnset) {
          this.expState = EXP_STATES.CHECK_EVOLUTION;
        }

        if (learnsetResult.success) {
          this.battleManager.openDialogBox(learnsetResult.text);
          console.log(learnsetResult.text); // Mew apprend XXX !

          this.expState = EXP_STATES.CHECK_EVOLUTION;
        }

        break;

      case EXP_STATES.CHECK_EVOLUTION:
        const evolution = checkEvolution(activePokemon);

        if (evolution.success) {
          this.expState = EXP_STATES.EVOLUTION;
          this.battleManager.openDialogBox(evolution.text); // `Quoi ! Mew évolue !?`
          console.log(evolution.text);
        }

        if (!evolution.success) {
          if (action === INPUT_STATE.ACTION) {
            console.log("Pas d'évolution, reprise de l'animation de la ExpBar");
            const animationTarget = this.hasLevelUp(activePokemon)
              ? activePokemon.nextLevelExp
              : activePokemon.exp;

            this.setExpBarTarget(activePokemon, animationTarget);

            this.expState = EXP_STATES.ANIMATING;
          }
        }
        break;

      case EXP_STATES.EVOLUTION:
        this.battleManager.game.screenManager.openEvolution(); // Ouvre l'écran d'évolution et commence la séquence
        break;

      default:
        break;
    }
  }
}
