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
import { BATTLE_MANAGER_STATES } from "../../../logic/gameplay/battleManager/states/battleManager.states.js";
import { BattleMovesMenu } from "./BattleMenu/BattleMovesMenu/BattleMovesMenu.model.js";
import { GAME_STATES } from "../../../logic/gameplay/game/states/states.gameplay.js";
import { BattleMenu } from "./BattleMenu/BattleMenu.model.js";
import { BattleResultManager } from "./BattleResultManager/BattleResultManager.model.js";
import { BattleStatsBox } from "../../pokemon/StatsBox/BattleStatsBox.model.js";
import { BATTLE_PHASES } from "./BattlePhaseManager/battlePhase.js";
import { AI } from "./AI/AI.model.js";
import { TurnManager } from "./TurnManager/TurnManager.model.js";

export class BattleManager {
  constructor(game, wildPokemon, tile, weather, battleType) {
    this.game = game;
    this.wildPokemon = wildPokemon;
    console.log(this.wildPokemon); // apparait plusieurs fois
    this.tile = tile;
    this.weather = weather;
    this.battleType = battleType;
    this.state = BATTLE_MANAGER_STATES.INTRO;
    this.position = {
      x: 0,
      y: 0,
    };
    this.canvas = this.game.canvas;
    this.width = 320;
    this.height = 320;
    this.isOpen = false;
    this.hasPlayerEscaped = false;
    this.isAttemptSwitch = false;
    this.isUseItem = false;
    this.usedItem = null;
    this.selectedMove = null;
    this.wildPokemonSelectedMove = null;
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

    this.battleRenderer.frontSlot.content = this.wildPokemon;
    this.battleRenderer.backSlot.content = this.currentPlayerPokemon;

    this.viewers.back.sprite.isPlaying = false;

    this.sequenceManager = new BattleSequenceManager({
      game: this.game,
      viewers: this.viewers,
      battleRenderer: this.battleRenderer,
      wildPokemon: this.wildPokemon,
      battleMenu: this.battleMenu,
    });

    this.phaseManager = new BattlePhaseManager(this, this.sequenceManager);
    this.resultManager = new BattleResultManager(this);

    this.debugStatsBoxes = [
      new BattleStatsBox(
        this.game,
        this.wildPokemon,
        { x: 330, y: 0 },
        "front"
      ),
      new BattleStatsBox(
        this.game,
        this.currentPlayerPokemon,
        {
          x: 330,
          y: 140,
        },
        "back"
      ),
    ];

    this.wildPokemonAI = new AI();
    this.turnManager = new TurnManager(this);
  }

  isHpAnimationFinished(pokemon) {
    return this.battleRenderer.isPokemonHpAnimationFinished(pokemon);
  }

  isExpAnimationFinished(pokemon) {
    return this.battleRenderer.isPokemonExpAnimationFinished(pokemon);
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

  selecteMove(moveData) {
    this.selectedMove = moveData;

    this.wildPokemonSelectMove();

    this.phaseManager.setPhase(BATTLE_PHASES.EXECUTE_TURN);
  }

  wildPokemonSelectMove() {
    this.wildPokemonSelectedMove = this.wildPokemonAI.chooseMove(
      this.wildPokemon
    );
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

  playerWantQuitBattle() {
    if (this.wildPokemon) this.hasPlayerEscaped = true;
  }

  updateDebugStatsBoxes(target, key) {
    let foundeDdebugStatsBox = this.debugStatsBoxes.find(
      (statBox) => statBox.side === key
    );
    foundeDdebugStatsBox.stats = this.currentPlayerPokemon.stats;
    if (target) foundeDdebugStatsBox.statStages = target.statStages;
  } // for debug

  update(context, action) {
    if (!this.isOpen) return;
    this.battleRenderer?.update(context);

    for (const viewer of Object.values(this.viewers))
      viewer.update(context, null);

    this.sequenceManager?.update(context, action);

    this.resultManager?.update(action);
    this.phaseManager?.update(action);

    for (const statBox of this.debugStatsBoxes) statBox?.update(context);
  }
}
