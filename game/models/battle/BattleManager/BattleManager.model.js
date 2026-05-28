import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { backgroundBox } from "../../../render/battle/battleRenderer/background.render.js";
import { BATTLE_BACKGROUND_DATABASE } from "../../../shareds/battle/background/battleBackground.database.js";
import { SpriteViewer } from "../../SpriteViewer/SpriteViewer.model.js";
import { Slot } from "../../Slot/Slot.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { HUD_CONFIG } from "../../../render/config/battle/hud.config.js";
import { PLAYER_BATTLE_INTRO_ANIMATION } from "../../../render/config/battle/introPlayerSprite.config.js";
import { getAnimationConfig } from "../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { DIALOGS_DATABASE } from "../../../shareds/dialogs/dialogs.database.js";
import { BattleIntroSequence } from "./BattleIntroSequence/BattleIntroSequence.model.js";

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
    this.game = game;
    this.isTrainerBattle = isTrainerBattle;
    this.wildPokemon = wildPokemon;
    this.trainer = trainer;
    this.position = {
      x: 0,
      y: 0,
    };
    this.name = "BATTLE";
    this.phase = "INTRO";
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.backgImage = null;
    this.music = null;
    this.weather = null;
    this.player = null;
    this.frontViewer = null;
    this.backViewer = null;
    this.firstPlayerPokemon = this.game.player.party.slots[0].content;
    this.frontSlot = new Slot(BATTLE_SLOT_CONFIG.front);
    this.backSlot = new Slot(BATTLE_SLOT_CONFIG.back);
    this.frontHUD = new HUD(this.wildPokemon, HUD_CONFIG.front);
    this.backHUD = new HUD(this.firstPlayerPokemon, HUD_CONFIG.back);
    this.setViewers();
    this.setBattleBackImg(tile);

    this.introSequence = new BattleIntroSequence(
      this.game,
      this.frontViewer,
      this.backViewer,
      this.frontSlot,
      this.backSlot,
      () => this.openDialogBox()
    );

    this.startIntroSequence();
  }

  open() {
    this.isOpen = true;
  }

  setBattleBackImg(tile) {
    const background = BATTLE_BACKGROUND_DATABASE[tile.terrain];
    if (background) this.backgImage = background.image;
  }

  setViewers() {
    this.frontViewer = new SpriteViewer(
      this.game,
      getAnimationConfig(this.wildPokemon.id, "front"),
      this.frontSlot
    );

    this.backViewer = new SpriteViewer(
      this.game,
      PLAYER_BATTLE_INTRO_ANIMATION,
      this.backSlot
    );
    this.backViewer.sprite.isPlaying = false;
  }

  startIntroSequence() {
    this.introSequence.start();
  }

  openDialogBox() {
    if (this.isTrainerBattle)
      this.game.dialogBox.open(
        DIALOGS_DATABASE.BATTLE_DIALOGS.trainerWantsToFight(this.trainer.name),
        true
      );
    else
      this.game.dialogBox.open(
        DIALOGS_DATABASE.BATTLE_DIALOGS.wildPokemonAppears(
          this.wildPokemon.name
        ),
        true
      );

    this.game.dialogBox.hasFocus = true;
  }

  close() {
    this.closePokemonViewer();
    this.game.dialogBox.close();
    this.isOpen = false;
  }

  closeDialogBox() {
    this.game.closeDialogBox(this.game);
  }

  // closePokemonViewer() {
  //   this.frontViewer.isOpen = false;
  //   this.frontViewer.sprite = null;
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
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    this.frontViewer?.update(context, null);
    this.backViewer?.update(context, null);

    if (this.introSequence.isFinished) this.frontHUD?.update(context);

    // if(playerSentOutPokemon)
    // this.backHUD?.update(context);

    // pour dev, fermeture de la boite à l'action de la touche A
    // if (result === this.game.dialogBox.noMorePage()) this.closeDialogBox();
    this.introSequence?.update();

    if (this.game.dialogBox.isOpen) {
      this.game.dialogBox.update(this.game.canvas.context, action);

      switch (action) {
        case "ACTION":
          if (this.introSequence.isFinished && this.game.dialogBox.isOpen) {
            this.backViewer.sprite.isPlaying = true;
          }
          break;

        default:
          break;
      }
    }
  }
}
