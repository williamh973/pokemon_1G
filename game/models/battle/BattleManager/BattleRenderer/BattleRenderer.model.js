import { BATTLE_BACKGROUND_DATABASE } from "../../../../shareds/battle/background/battleBackground.database.js";

export class BattleRenderer {
  constructor(game, slots, huds, tile) {
    this.game = game;
    this.tile = tile;
    this.backgroundImg = this.setBattleBackImg();
    this.frontSlot = slots.frontSlot;
    this.backSlot = slots.backSlot;
    this.frontHUD = huds.frontHUD;
    this.backHUD = huds.backHUD;
  }

  isPokemonHpAnimationFinished(pokemon) {
    const hud =
      this.frontHUD.pokemon === pokemon ? this.frontHUD : this.backHUD;

    if (hud.HPbar.targetHp !== pokemon.stats.hp) return false;

    return !hud.HPbar.isAnimating;
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

    const expBar = hud.expBar;

    if (expBar.targetExp !== pokemon.exp) return false;
    if (expBar.currentExp !== pokemon.exp) return false;

    return !expBar.isAnimating;
  }

  setBattleBackImg() {
    const background = BATTLE_BACKGROUND_DATABASE[this.tile.terrain];
    const defaultBackground = BATTLE_BACKGROUND_DATABASE["default"];

    if (background) return (this.backgroundImg = background.image);
    else return (this.backgroundImg = defaultBackground.image);
  }

  draw(context) {
    context.drawImage(
      this.backgroundImg,
      this.game.canvas.position.x,
      this.game.canvas.position.y,
      this.game.canvas.width,
      this.game.canvas.height
    );
  }

  update(context) {
    this.draw(context);
    this.frontSlot.update(context);
    this.backSlot.update(context);
  }
}
