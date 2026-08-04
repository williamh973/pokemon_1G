import { SpriteViewer } from "../../SpriteViewer/SpriteViewer.model.js";
import { PLAYER_BATTLE_INTRO_ANIMATION } from "../../../render/config/battle/battleIntroPlayerSprite.config.js";
import { getAnimationConfig } from "../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { BattleRenderer } from "./BattleRenderer/BattleRenderer.model.js";
import { Slot } from "../../Slot/Slot.model.js";
import { HUD } from "./Hud/HUD.model.js";
import { HUD_CONFIG } from "../../../render/config/battle/hud.config.js";
import { BATTLE_SLOT_CONFIG } from "../../../logic/gameplay/battleManager/slots/battleSlots.config.js";
import { BattlePhaseManager } from "./BattlePhaseManager/BattlePhaseManager.model.js";
import { BattleSequenceManager } from "./BattleSequenceManager/BattleSequenceManager.model.js";
import { INPUT_STATE } from "../../../logic/input/inputs.state.js";
import { DIALOGS_DATABASE } from "../../../shareds/dialogs/dialogs.database.js";
import { BATTLE_MANAGER_STATES } from "../../../logic/gameplay/battleManager/slots/states/battleManager.states.js";
import { BattleMovesMenu } from "./BattleMenu/BattleMovesMenu/BattleMovesMenu.model.js";
import { GAME_STATES } from "../../../logic/gameplay/game/states/states.gameplay.js";
import { BattleMenu } from "./BattleMenu/BattleMenu.model.js";

export class BattleManager {
  constructor(game, wildPokemon, tile, weather, battleType) {
    this.game = game;
    this.wildPokemon = wildPokemon;
    this.tile = tile;
    this.weather = weather;
    this.battleType = battleType;
    this.state = BATTLE_MANAGER_STATES.INTRO;
    this.position = {
      x: 0,
      y: 0,
    };
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.hasPlayerEscaped = false;
    this.hasCaptured = false;
    this.isAttemptSwitch = false;
    this.isUseItem = false;
    this.usedItem = null;
    this.music = null;
    this.battleResult = null;
    this.currentTrainerPokemon = null;
    this.currentPlayerPokemon = this.getPlayerPartyPokemon(0);

    this.battleMenu = new BattleMenu(this.game);
    this.battleMovesMenu = new BattleMovesMenu(this.game);

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

  openBattleMenu() {
    this.battleMenu.open();
    this.game.state = GAME_STATES.BATTLE_MENU;
  }

  openBattleMovesMenu() {
    this.battleMovesMenu.currentPlayerPokemon = this.currentPlayerPokemon;
    this.battleMovesMenu.open();
    this.game.state = GAME_STATES.BATTLE_MOVES_MENU;
  }

  handleBattleMoves(playerPokemonSelectedMoveData) {
    console.log(playerPokemonSelectedMoveData);
  }

  requestSwitch() {
    const party = this.game.player.party;
    const alreadyInBattleText = `${this.currentPlayerPokemon.name} est déjà au combat`;

    if (this.currentPlayerPokemon === party.slots[party.currentIndex].content) {
      this.openDialogBox(alreadyInBattleText);
      this.game.dialogBox.hasFocus = true;
      return;
    } else {
      this.isAttemptSwitch = true;
      this.game.screenManager.setCurrentScreen(this);
    }
  }

  getPlayerPartyPokemon(currentIndex) {
    const playerParty = this.game.player.party;
    return playerParty.slots[currentIndex].content;
  }

  open() {
    this.isOpen = true;
  }

  openDialogBox(text) {
    this.game.dialogBox.open(text, true);
  }

  close() {
    this.game.dialogBox.close();
    this.isOpen = false;
  }

  checkPlayerEscaped(action) {
    if (this.hasPlayerEscaped) {
      this.openDialogBox(`Vous prenez la fuite!`);

      if (action === INPUT_STATE.ACTION) {
        const pokedexState = this.game.player.pokedex.pokemonList.pokedexState;
        pokedexState.addSee(this.wildPokemon.id);

        this.endBattle();

        this.hasPlayerEscaped = false;
      }
    }
  }

  playerWantQuitBattle() {
    if (this.wildPokemon) this.hasPlayerEscaped = true;
  }

  endBattle() {
    this.game.transition.start(
      () => {
        this.game.togglePause(false, true);
      },
      (done) => {
        this.game.screenManager.close(GAME_STATES.WORLD);
        this.game.onBattleEnded();
        done();
      },
      () => {}
    );
  }

  checkPokemonCaptured(action) {
    if (this.sequenceManager.battleCatchSequence?.hasCaptured) {
      this.state = BATTLE_MANAGER_STATES.CAPTURED;

      this.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.pokemonCaptured(this.wildPokemon.name)
      );

      if (
        action === INPUT_STATE.ACTION &&
        this.state === BATTLE_MANAGER_STATES.CAPTURED
      ) {
        this.state = BATTLE_MANAGER_STATES.ADD_POKEDEX;

        const emptySlot = this.game.player.party.addPokemonToFirstEmptySlot(
          this.wildPokemon
        );

        if (emptySlot) {
          const pokedexState =
            this.game.player.pokedex.pokemonList.pokedexState;
          const hasPokedexAddedPokemon = pokedexState.addCatch(
            this.wildPokemon.id
          );

          if (hasPokedexAddedPokemon) {
            this.state = BATTLE_MANAGER_STATES.ADD_POKEDEX;
            this.openDialogBox(`${this.wildPokemon.name} a été au pokedex !`);
            this.game.stopWildBattle(); // Le déclencher avec un counter
          } else this.game.stopWildBattle();
        }

        // this.openDialogBox(
        //   `Plus de place dans l'équipe\n${this.wildPokemon.name} est transféré au pc`
        // );
      }
    }
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.checkPokemonCaptured(action);

    this.checkPlayerEscaped(action);

    this.battleRenderer?.update(context);

    for (const viewer of Object.values(this.viewers))
      viewer.update(context, null);

    this.sequenceManager?.update(context, action);

    this.phaseManager?.update(action);

    if (this.game.dialogBox.isOpen)
      this.game.dialogBox.update(this.game.canvas.context, action);
  }
}
