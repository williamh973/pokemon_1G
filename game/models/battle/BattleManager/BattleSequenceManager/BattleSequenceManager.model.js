import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
import { Pokeball } from "../Pokeball/Pokeball.model.js";
import { BattleCatchSequence } from "../sequences/BattleCatchSequence/BattleCatchSequence.model.js";
import { BattleIntroSequence } from "../sequences/BattleIntroSequence/BattleIntroSequence.model.js";
import { BattlePlayerThrowSequence } from "../sequences/BattlePlayerThrowSequence/BattlePlayerThrowSequence.model.js";
import { PokemonAppearsSequence } from "../sequences/PokemonAppearsSequence/PokemonAppearsSequence.model.js";
import { PokemonDisappearsSequence } from "../sequences/PokemonDisappearsSequence/PokemonDisappearsSequence.model.js";

export class BattleSequenceManager {
  constructor(context) {
    this.game = context.game;
    this.viewers = context.viewers;
    this.battleRenderer = context.battleRenderer;
    this.wildPokemon = context.wildPokemon;
    this.currentPlayerPokemon = context.currentPlayerPokemon;
    this.battleMenu = context.battleMenu;
    this.countdownBeforeStartCatchSeq = 30;
  }

  openDialogBox(text) {
    this.game.dialogBox.open(text, true);
  }

  closeDialogBox() {
    this.game.dialogBox.close();
  }

  startIntroSequence() {
    this.introSequence = new BattleIntroSequence(
      this.game,
      this.viewers,
      this.battleRenderer.frontSlot,
      this.battleRenderer.backSlot,
      () =>
        this.openDialogBox(
          DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonAppears(
            this.wildPokemon.name
          )
        )
    );

    this.introSequence.start();
  }

  startPlayerThrowSequence() {
    this.playerThrowSequence = new BattlePlayerThrowSequence(
      this.game,
      this.viewers,
      this.battleRenderer.backSlot
    );

    this.playerThrowSequence.start();
  }

  startPokemonAppearsSequence() {
    this.pokemonAppearsSequence = new PokemonAppearsSequence(
      this.game,
      this.viewers,
      this.currentPlayerPokemon,
      this.battleRenderer.backSlot
    );

    this.pokemonAppearsSequence.start();
  }

  startBattleCatchSequence(usedItem) {
    this.battleCatchSequence = new BattleCatchSequence(
      this.game,
      this.viewers,
      this.battleRenderer.frontSlot,
      this.wildPokemon,
      usedItem
    );
  }

  startPokemonDisappearsSequence() {
    this.pokemonDisappearsSequence = new PokemonDisappearsSequence(
      this.game,
      this.viewers,
      this.currentPlayerPokemon,
      this.battleRenderer.backSlot
    );

    this.pokemonAppearsSequence.start();
  }

  handleCountdownForStartCatchSequence() {
    if (this.countdownBeforeStartCatchSeq > 0)
      this.countdownBeforeStartCatchSeq--;
    else this.countdownBeforeStartCatchSeq = 30;

    if (
      this.countdownBeforeStartCatchSeq === 0 &&
      !this.battleCatchSequence?.isStarted
    ) {
      this.battleCatchSequence?.start();
    }
  }

  update(context) {
    if (this.battleCatchSequence) this.handleCountdownForStartCatchSequence();

    if (this.introSequence.isFinished)
      this.battleRenderer.frontHUD?.update(context);

    if (this.pokemonAppearsSequence?.isFinished)
      this.battleRenderer.backHUD?.update(context);

    if (!this.introSequence.isFinished) this.introSequence.update();

    if (!this.playerThrowSequence?.isFinished)
      this.playerThrowSequence?.update(context);

    if (!this.pokemonAppearsSequence?.isFinished)
      this.pokemonAppearsSequence?.update();

    if (!this.battleCatchSequence?.isFinished)
      this.battleCatchSequence?.update(context);
  }
}
