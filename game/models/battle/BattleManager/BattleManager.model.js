import { SpriteViewer } from "../../SpriteViewer/SpriteViewer.model.js";
import { PLAYER_BATTLE_INTRO_ANIMATION } from "../../../render/config/battle/introPlayerSprite.config.js";
import { getAnimationConfig } from "../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { DIALOGS_DATABASE } from "../../../shareds/dialogs/dialogs.database.js";
import { BattleRenderer } from "./BattleRenderer/BattleRenderer.model.js";
import { Slot } from "../../Slot/Slot.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { HUD_CONFIG } from "../../../render/config/battle/hud.config.js";
import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { BATTLE_PHASES } from "./battlePhase/battlePhase.js";
import { BattleSequenceManager } from "./sequences/BattleSequenceManager/BattleSequenceManager.model.js";
import { BattlePhaseManager } from "./battlePhase/BattlePhase.model.js";

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
    this.trainer = trainer;
    this.wildPokemon = wildPokemon;
    this.position = {
      x: 0,
      y: 0,
    };
    this.name = "BATTLE";
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.music = null;
    this.weather = null;
    this.player = this.game.player;
    this.firstPlayerPokemon = this.game.player.party.slots[0].content;
    this.battleRenderer = new BattleRenderer(
      this.game,
      {
        frontSlot: new Slot(BATTLE_SLOT_CONFIG.front),
        backSlot: new Slot(BATTLE_SLOT_CONFIG.back),
      },
      {
        frontHUD: new HUD(this.wildPokemon, HUD_CONFIG.front),
        backHUD: new HUD(this.firstPlayerPokemon, HUD_CONFIG.back),
      },
      tile
    );

    this.viewers = {
      front: new SpriteViewer(
        this.game,
        getAnimationConfig(this.wildPokemon.id, "front"),
        this.battleRenderer.frontSlot
      ),
      back: new SpriteViewer(
        this.game,
        PLAYER_BATTLE_INTRO_ANIMATION,
        this.battleRenderer.backSlot
      ),
    };
    this.viewers.back.sprite.isPlaying = false;

    this.sequenceManager = new BattleSequenceManager({
      game: this.game,
      viewers: this.viewers,
      battleRenderer: this.battleRenderer,
      wildPokemon: this.wildPokemon,
      firstPlayerPokemon: this.firstPlayerPokemon,
    });

    this.phaseManager = new BattlePhaseManager(this, this.sequenceManager); // doit il connaitre sequenceManager ?
  }

  open() {
    this.isOpen = true;
  }

  openDialogBox(text) {
    this.game.dialogBox.open(text, true);
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

  update(context, action) {
    if (!this.isOpen) return;

    this.battleRenderer?.update(context);

    for (const viewer of Object.values(this.viewers))
      viewer.update(context, null);

    this.sequenceManager?.update(context);

    this.phaseManager?.update(action);

    console.log(this.phaseManager.currentPhase);

    if (this.game.dialogBox.isOpen)
      this.game.dialogBox.update(this.game.canvas.context, action);
  }
}
