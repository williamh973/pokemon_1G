import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
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

  startPokemonAppearsSequence(pokemon, key) {
    this.pokemonAppearsSequence = new PokemonAppearsSequence(
      this.game,
      this.viewers,
      pokemon,
      key
    );

    this.pokemonAppearsSequence.start();
  }

  initBattleCatchSequence(ball) {
    this.battleCatchSequence = new BattleCatchSequence(
      this.game,
      this.viewers,
      this.battleRenderer.frontSlot,
      this.wildPokemon,
      ball
    );
  }

  initPokemonDisappearsSequence(key) {
    this.pokemonDisappearsSequence = new PokemonDisappearsSequence(
      this.game,
      key
    );
  }

  update(context) {
    console.log(this.pokemonAppearsSequence?.isFinished);

    if (this.introSequence?.isFinished)
      this.battleRenderer.frontHUD?.update(context);

    if (!this.introSequence.isFinished) this.introSequence.update();

    if (this.playerThrowSequence?.isFinished)
      this.battleRenderer.backHUD?.update(context);

    if (!this.playerThrowSequence?.isFinished)
      this.playerThrowSequence?.update(context);

    if (this.pokemonAppearsSequence?.isFinished) {
      this.pokemonAppearsSequence = null;
      if (this.battleCatchSequence) this.battleCatchSequence.isFinished = true;
    } else this.pokemonAppearsSequence?.update();

    if (!this.battleCatchSequence?.isFinished)
      this.battleCatchSequence?.update(context);
  }
}
