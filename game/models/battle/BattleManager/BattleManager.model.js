import { SpriteViewer } from "../../SpriteViewer/SpriteViewer.model.js";
import { PLAYER_BATTLE_INTRO_ANIMATION } from "../../../render/config/battle/introPlayerSprite.config.js";
import { getAnimationConfig } from "../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { DIALOGS_DATABASE } from "../../../shareds/dialogs/dialogs.database.js";
import { BattleIntroSequence } from "./sequences/BattleIntroSequence/BattleIntroSequence.model.js";
import { BattleRenderer } from "./BattleRenderer/BattleRenderer.model.js";
import { Slot } from "../../Slot/Slot.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { HUD_CONFIG } from "../../../render/config/battle/hud.config.js";
import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { BATTLE_PHASES } from "../battlePhase/battlePhase.js";
import { BattlePlayerThrowSequence } from "./sequences/BattleIntroSequence/BattlePlayerThrowSequence/BattlePlayerThrowSequence.model.js";
import { Pokeball } from "./Pokeball/Pokeball.model.js";

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
    this.trainer = trainer;
    this.wildPokemon = wildPokemon;
    this.position = {
      x: 0,
      y: 0,
    };
    this.name = "BATTLE";
    this.phase = BATTLE_PHASES.INTRO;
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
    this.sequences = [];
    this.startIntroSequence();
  }

  open() {
    this.isOpen = true;
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
      () => {
        this.pokeball = new Pokeball(
          {
            x: 0,
            y: this.viewers.back.sprite.position.y, // 50
          },
          this.battleRenderer.backSlot
        );
      }
    );

    this.playerThrowSequence.start();
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

    if (this.introSequence.isFinished)
      this.battleRenderer.frontHUD?.update(context);

    if (this.phase === BATTLE_PHASES.POKEMON_APPEARS)
      this.battleRenderer.backHUD?.update(context);

    if (!this.introSequence.isFinished) this.introSequence.update();
    if (!this.playerThrowSequence?.isFinished)
      this.playerThrowSequence?.update();

    if (this.playerThrowSequence?.isFinished) this.pokeball?.update(context);

    if (this.game.dialogBox.isOpen) {
      this.game.dialogBox.update(this.game.canvas.context, action);
      switch (action) {
        case "ACTION":
          if (
            this.phase === BATTLE_PHASES.INTRO &&
            this.introSequence.isFinished &&
            this.game.dialogBox.isOpen
          ) {
            this.phase = BATTLE_PHASES.PLAYER_THROW_POKEBALL;
            this.startPlayerThrowSequence();
            this.openDialogBox(
              DIALOGS_DATABASE.BATTLE_DIALOGS.playerSentOutPokemon(
                this.firstPlayerPokemon.name
              )
            );
          }
          break;

        default:
          break;
      }
    }
  }
}
