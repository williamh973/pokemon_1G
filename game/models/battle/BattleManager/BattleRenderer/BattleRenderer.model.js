import { BATTLE_BACKGROUND_DATABASE } from "../../../../shareds/battle/background/battleBackground.database.js";
import { BattleBackgroundEffectManager } from "./BattleBackgroundEffectManager/BattleBackgroundEffectManager.model.js";

export class BattleRenderer {
  constructor(game, slots, huds, tile) {
    this.game = game;
    this.tile = tile;

    this.battleBackgroundImage = this.setBattleBackImg();

    this.frontSlot = slots.frontSlot;
    this.backSlot = slots.backSlot;

    this.frontHUD = huds.frontHUD;
    this.backHUD = huds.backHUD;

    this.battleBackgroundEffectManager = new BattleBackgroundEffectManager(
      game
    );
  }

  isPokemonHpAnimationFinished(pokemon) {
    const hud =
      this.frontHUD.pokemon === pokemon ? this.frontHUD : this.backHUD;

    if (hud.HPbar.targetHp !== pokemon.stats.hp) return false;

    return !hud.HPbar.isAnimating;
  }

  getPokemonExpBar(pokemon) {
    if (this.frontHUD.pokemon === pokemon) {
      return this.frontHUD.expBar;
    }

    if (this.backHUD.pokemon === pokemon) {
      return this.backHUD.expBar;
    }

    return null;
  }

  isPokemonExpAnimationFinished(pokemon) {
    let hud = null;

    if (this.frontHUD.pokemon === pokemon) {
      hud = this.frontHUD;
    } else if (this.backHUD.pokemon === pokemon) {
      hud = this.backHUD;
    } else {
      return false;
    }

    if (!hud) return false;

    return !hud.expBar.isAnimating;
  }

  setBattleBackImg() {
    const backgroundFromDB = BATTLE_BACKGROUND_DATABASE[this.tile.terrain];
    if (backgroundFromDB) {
      return (this.battleBackgroundImage = backgroundFromDB.image);
    } else {
      const defaultBackground = BATTLE_BACKGROUND_DATABASE["default"];
      return (this.battleBackgroundImage = defaultBackground.image);
    }
  }

  setBattleBackgroundFromMoveAnimation(image) {
    this.battleBackgroundImage = image;
  }

  draw(context) {
    const x = this.game.canvas.position.x;
    const y = this.game.canvas.position.y;
    const width = this.game.canvas.width;
    const height = this.game.canvas.height;

    this.battleBackgroundEffectManager.drawBackground(
      context,
      this.battleBackgroundImage,
      x,
      y,
      width,
      height
    );
  }

  update(context) {
    this.battleBackgroundEffectManager.update(context);
    this.draw(context);

    this.battleBackgroundEffectManager.drawColor(
      context,
      this.game.canvas.position.x,
      this.game.canvas.position.y,
      this.game.canvas.width,
      this.game.canvas.height
    );

    this.frontSlot.update(context);
    this.backSlot.update(context);
  }
}
