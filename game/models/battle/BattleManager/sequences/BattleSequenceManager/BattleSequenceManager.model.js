import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";
import { Pokeball } from "../../Pokeball/Pokeball.model.js";
import { BattleIntroSequence } from "../BattleIntroSequence/BattleIntroSequence.model.js";
import { BattlePlayerThrowSequence } from "../BattleIntroSequence/BattlePlayerThrowSequence/BattlePlayerThrowSequence.model.js";
import { PokemonAppearsSequence } from "../BattleIntroSequence/PokemonAppearsSequence/PokemonAppearsSequence.model.js";

export class BattleSequenceManager {
  constructor(context) {
    this.game = context.game;
    this.viewers = context.viewers;
    this.battleRenderer = context.battleRenderer;
    this.wildPokemon = context.wildPokemon;
    this.firstPlayerPokemon = context.firstPlayerPokemon;
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
      this.viewers,
      () => {
        this.pokeball = new Pokeball(
          {
            x: 0,
            y: this.viewers.back.sprite.position.y,
          },
          this.battleRenderer.backSlot
        );
      }
    );

    this.playerThrowSequence.start();
  }

  startPokemonAppearsSequence() {
    this.pokemonAppearsSequence = new PokemonAppearsSequence(
      this.game,
      this.viewers,
      this.firstPlayerPokemon,
      this.battleRenderer.backSlot
    );

    this.pokemonAppearsSequence.start();
  }

  update(context) {
    if (this.introSequence.isFinished)
      this.battleRenderer.frontHUD?.update(context);

    if (this.pokemonAppearsSequence?.isFinished)
      this.battleRenderer.backHUD?.update(context);

    if (!this.introSequence.isFinished) this.introSequence.update();

    if (this.playerThrowSequence?.isFinished) this.pokeball?.update(context);

    if (!this.playerThrowSequence?.isFinished)
      this.playerThrowSequence?.update();

    if (!this.pokemonAppearsSequence?.isFinished)
      this.pokemonAppearsSequence?.update();
  }
}
