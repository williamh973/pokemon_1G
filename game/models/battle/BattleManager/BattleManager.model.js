import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { backgroundBox } from "../../../render/battle/battleRenderer/background.render.js";
import { BATTLE_BACKGROUND_DATABASE } from "../../../shareds/battle/background/battleBackground.database.js";
import { PokemonViewer } from "../../PokemonViewer/PokemonViewer.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { Slot } from "./slot/Slot.model.js";

// - état du combat
// - tours
// - actions
// - attaques
// - dégâts
// - KO
// - capture
// - victoire/défaite
// - transitions de phase

export class BattleManager {
  constructor(
    game,
    isTrainerBattle = false,
    wildPokemon = null,
    trainer = null,
    tile
  ) {
    this.backgImage = null;
    this.setBattleBackImg(tile);
    this.position = {
      x: 0,
      y: 0,
    };
    this.game = game;
    this.name = "BATTLE";
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.music = null;
    this.isSlideAnimationFinished = false;
    this.isTrainerBattle = isTrainerBattle;
    this.weather = null;
    this.firstPlayerPokemon = this.game.player.party.slots[0].content;
    this.enemy = wildPokemon; // pokemon sauvage généré pendant une rencontre
    this.trainer = trainer; // dresseur adverse rencontré
    this.frontSlot = new Slot(BATTLE_SLOT_CONFIG.front);
    this.backSlot = new Slot(BATTLE_SLOT_CONFIG.back);

    this.frontViewer = new PokemonViewer(
      this.game,
      this.enemy,
      this.frontSlot,
      "front"
    );

    this.backViewer = new PokemonViewer(
      this.game,
      this.firstPlayerPokemon,
      this.backSlot,
      "back"
    );

    this.frontHUD = new HUD(this.enemy, {
      x: 10,
      y: 10,
      width: 130,
      height: 60,
      isPlayerHUD: false,
    });
    this.backHUD = new HUD(this.firstPlayerPokemon, {
      x: 180,
      y: 150,
      width: 130,
      height: 60,
      isPlayerHUD: true,
    });
  }

  open() {
    this.isOpen = true;
    this.startIntroSequence();
  }

  startIntroSequence() {
    this.openPokemonViewer();
    this.setSpriteInitalPosition();
    this.openDialogBox();
  }

  openDialogBox() {
    this.game.dialogBox.open(`Un ${this.enemy.name} sauvage apparait!`, true);
    this.game.dialogBox.hasFocus = true;
  }

  openPokemonViewer() {
    this.frontViewer.isOpen = true;
    this.backViewer.isOpen = true;
  }

  close() {
    this.closePokemonViewer();
    this.game.dialogBox.close();
    this.isOpen = false;
  }

  closeDialogBox() {
    this.game.closeDialogBox(this.game);
  }

  setBattleBackImg(tile) {
    const background = BATTLE_BACKGROUND_DATABASE[tile.terrain];
    if (background) this.backgImage = background.image;
  }

  // closePokemonViewer() {
  //   this.frontViewer.isOpen = false;
  //   this.frontViewer.pokemonSprite = null;
  //   this.frontViewer = null;
  // }

  resetCurrentScreen() {
    this.game.resetCurrentScreen();
  }

  backgroundBox(context) {
    backgroundBox(context, this);
  }

  draw(context) {
    context.fillStyle = "white";
    if (this.backgImage !== null) this.backgroundBox(context);
    this.slideAnimation();
  }

  setSpriteInitalPosition() {
    this.frontViewer.pokemonSprite.position.x =
      0 - this.frontViewer.pokemonSprite.config.frameWidth;
  }

  spriteFinalPosition() {
    return (
      this.frontViewer.pokemonSprite.position.x >=
      this.frontSlot.position.x +
        (this.frontSlot.width - this.frontViewer.pokemonSprite.frameWidth) / 2
    );
  }

  slideAnimation() {
    if (this.spriteFinalPosition())
      return (this.isSlideAnimationFinished = true);

    this.frontViewer.pokemonSprite.position.x += 4;
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    this.frontViewer?.update(context, null);
    this.backViewer?.update(context, null);

    if (this.isSlideAnimationFinished) {
      this.frontHUD?.update(context);
      this.backHUD?.update(context);
    }

    if (this.game.dialogBox.isOpen) {
      const result = this.game.dialogBox.update(
        this.game.canvas.context,
        action
      );

      // pour dev, fermeture de la boite à l'action de la touche A
      if (result === this.game.dialogBox.noMorePage()) this.closeDialogBox();
    }
  }
}
