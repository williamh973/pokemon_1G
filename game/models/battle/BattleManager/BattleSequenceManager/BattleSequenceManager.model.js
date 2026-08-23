import { DIALOGS_DATABASE } from "../../../../shareds/dialogs/dialogs.database.js";
import { BattleCatchSequence } from "../sequences/BattleCatchSequence/BattleCatchSequence.model.js";
import { BattleIntroSequence } from "../sequences/BattleIntroSequence/BattleIntroSequence.model.js";
import { BattlePlayerThrowSequence } from "../sequences/BattlePlayerThrowSequence/BattlePlayerThrowSequence.model.js";
import { BattleSwitchSequence } from "../sequences/BattleSwitchSequence/BattleSwitchSequence.model.js";
import { PokemonAppearsSequence } from "../sequences/PokemonAppearsSequence/PokemonAppearsSequence.model.js";
import { PokemonDisappearsSequence } from "../sequences/PokemonDisappearsSequence/PokemonDisappearsSequence.model.js";
import { PokemonUseMoveSequence } from "../sequences/PokemonUseMoveSequence/PokemonUseMoveSequence.model.js";

export class BattleSequenceManager {
  constructor(context) {
    this.game = context.game;
    this.viewers = context.viewers;
    this.battleRenderer = context.battleRenderer;
    this.wildPokemon = context.wildPokemon;
    // this.currentPlayerPokemon = context.currentPlayerPokemon;
    this.battleMenu = context.battleMenu;

    this.pokemonAppearsSequence = null;
    this.pokemonDisappearsSequence = null;
  }

  startIntroSequence() {
    this.introSequence = new BattleIntroSequence(
      this.game,
      this.viewers,
      () =>
        this.game.dialogBox.open(
          DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonAppears(
            this.wildPokemon.name
          )
        ),
      true
    );

    this.introSequence.start();
  }

  startPlayerThrowSequence() {
    this.playerThrowSequence = new BattlePlayerThrowSequence(
      this.game,
      this.viewers
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

  startPokemonDisappearsSequence(key) {
    this.pokemonDisappearsSequence = new PokemonDisappearsSequence(
      this.game,
      key
    );
    this.pokemonDisappearsSequence.start();
  }

  initBattleCatchSequence(ball) {
    this.battleCatchSequence = new BattleCatchSequence(
      this.game,
      this.viewers,
      this.wildPokemon,
      ball
    );
  }

  startBattleSwitchSequence(key) {
    this.battleSwitchSequence = new BattleSwitchSequence(
      this.game,
      {
        playerParty: this.game.player.party,
        playerTargetPokemon: this.game.battleManager.getPlayerPartyPokemon(
          this.game.player.party.currentIndex
        ),
      },
      this,
      key
    );
    this.battleSwitchSequence.start();
  }

  startPokemonUseMoveSequence(turnAction) {
    this.pokemonUseMoveSequence = new PokemonUseMoveSequence(
      this.game,
      this.viewers,
      turnAction
    );
  }

  update(context, action) {
    if (this.introSequence?.isFinished) {
      this.battleRenderer.frontHUD?.update(context);
      this.battleRenderer.backHUD?.update(context);
    }

    if (!this.introSequence.isFinished) this.introSequence.update();

    if (!this.playerThrowSequence?.isFinished)
      this.playerThrowSequence?.update(context);

    if (this.pokemonAppearsSequence?.isFinished) {
      this.pokemonAppearsSequence = null;
      this.playerThrowSequence = null;

      if (this.battleCatchSequence) this.battleCatchSequence.isFinished = true;
    } else this.pokemonAppearsSequence?.update();

    if (!this.battleCatchSequence?.isFinished)
      this.battleCatchSequence?.update(context);

    if (!this.battleSwitchSequence?.isFinished)
      this.battleSwitchSequence?.update(context);

    if (!this.pokemonUseMoveSequence?.isFinished)
      this.pokemonUseMoveSequence?.update(context);
  }
}
