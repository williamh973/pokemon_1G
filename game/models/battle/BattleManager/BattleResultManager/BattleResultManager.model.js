import { EXP_STATES } from "../../../../logic/gameplay/battleManager/experience/expStates.states.js";
import { resetTeamStatStages } from "../../../../logic/gameplay/battleManager/turnManager/statStages/resetStatStages.gameplay.js";
import { TURN_STATES } from "../../../../logic/gameplay/battleManager/turnManager/states/turnManager.states.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { levelUpProcess } from "../../../../logic/gameplay/pokemon/levelUp/levelUp.gameplay.js";
import { calculateExpGain } from "../experiences/calculateExpGain.gameplay.js";

export class BattleResultManager {
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.battlePhaseManager = this.battleManager.phaseManager;

    this.isKoProcessed = false;

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

    this.gainedExp = 300; // calculateExpGain(fainted);

    console.log("XP à gagner :", this.gainedExp);
  }

  hasLevelUp(pokemon) {
    return pokemon.exp >= pokemon.nextLevelExp;
  }

  startExpGain() {
    this.expState = EXP_STATES.ANIMATING;

    const { active } = this.battleManager.turnManager.koAction;

    this.targetExp = active.exp + this.gainedExp;

    active.exp = this.targetExp;

    console.log("XP gagnée :", this.gainedExp);
    console.log("XP totale :", active.exp);

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

    if (this.expState === EXP_STATES.ANIMATING) {
      const { active } = this.battleManager.turnManager.koAction;

      if (this.battleManager.isExpAnimationFinished(active)) {
        if (this.hasLevelUp(active)) {
          this.expState = EXP_STATES.LEVEL_UP;
        } else {
          this.expState = EXP_STATES.FINISHED;
        }
      }
    }

    if (this.expState === EXP_STATES.LEVEL_UP) {
      const { active } = this.battleManager.turnManager.koAction;

      console.log(`${active.name} : LEVEL_UP → traitement du level-up`);

      const levelUpResult = levelUpProcess(null, active, false);

      if (levelUpResult.success && levelUpResult.text)
        this.battleManager.openDialogBox(levelUpResult.text);

      console.log("Pokémon après level-up :", levelUpResult.pokemon);

      const animationTarget = this.hasLevelUp(active)
        ? active.nextLevelExp
        : active.exp;

      this.setExpBarTarget(levelUpResult.pokemon, animationTarget);

      this.expState = EXP_STATES.ANIMATING;
    }
  }
}
