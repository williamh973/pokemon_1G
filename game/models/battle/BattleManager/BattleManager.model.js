import { SpriteViewer } from "../../SpriteViewer/SpriteViewer.model.js";
import { PLAYER_BATTLE_INTRO_ANIMATION } from "../../../render/config/battle/introPlayerSprite.config.js";
import { getAnimationConfig } from "../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { BattleRenderer } from "./BattleRenderer/BattleRenderer.model.js";
import { Slot } from "../../Slot/Slot.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { HUD_CONFIG } from "../../../render/config/battle/hud.config.js";
import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { BattlePhaseManager } from "./BattlePhaseManager/BattlePhaseManager.model.js";
import { BattleSequenceManager } from "./BattleSequenceManager/BattleSequenceManager.model.js";

export class BattleManager {
  constructor(game, wildPokemon, tile) {
    this.game = game;
    this.wildPokemon = wildPokemon;
    this.tile = tile;
    this.position = {
      x: 0,
      y: 0,
    };
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.isEscaped = false;
    this.isUseItem = false;
    this.usedItem = null;
    this.music = null;
    this.weather = null;
    this.battleResult = null;
    this.battleType = null;
    this.currentPlayerPokemon = this.game.player.party.slots[0].content;
    this.currentTrainerPokemon = null;
    this.battleRenderer = new BattleRenderer(
      this.game,
      {
        frontSlot: new Slot(BATTLE_SLOT_CONFIG.front),
        backSlot: new Slot(BATTLE_SLOT_CONFIG.back),
      },
      {
        frontHUD: new HUD(this.wildPokemon, HUD_CONFIG.front),
        backHUD: new HUD(this.currentPlayerPokemon, HUD_CONFIG.back),
      },
      this.tile
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
      currentPlayerPokemon: this.currentPlayerPokemon,
      battleMenu: this.battleMenu,
    });

    this.phaseManager = new BattlePhaseManager(this, this.sequenceManager);
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

  update(context, action) {
    if (!this.isOpen) return;

    this.battleRenderer?.update(context);

    for (const viewer of Object.values(this.viewers))
      viewer.update(context, null);

    this.sequenceManager?.update(context);

    this.phaseManager?.update(action);

    if (this.game.dialogBox.isOpen)
      this.game.dialogBox.update(this.game.canvas.context, action);
  }
}
