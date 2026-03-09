import { animate } from "../../render/animate.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { MapManager } from "../Map/MapManager.model.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { MainMenu } from "../MainMenu/MainMenu.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { Save } from "../MainMenu/items/Save/save.model.js";
import { TitleScreen } from "../TitleScreen/TitleScreen.model.js";
import { MAPS } from "../../shareds/map/maps.registry.js";
import { ChoiceMenu } from "../ChoiceMenu/ChoiceMenu.model.js";
import { DIALOGS_TREE_DATABASE } from "../../shareds/dialogTree/dialogTree.database.js";
import {
  dispatchMenuSelection,
  loadGame,
  startTransitionBeforeOpenWorldMap,
} from "../../logic/gameplay/game/game.gameplay.js";
import { GAME_FLAGS } from "../../shareds/utils/game/game.utils.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { FADING_TIME } from "../../shareds/utils/fade/fade.assets.js";
import { Player } from "../Character/Player/Player.model.js";
import { ScenarioManager } from "../ScenarioManager/ScenarioManager.model.js";

export class Game {
  constructor() {
    this.state = "WORLD";
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.playedWith = "red";
    this.player = new Player(this, this.playedWith);
    this.flags = GAME_FLAGS;
    this.mapManager = new MapManager(this, MAPS);
    this.scenarioManager = new ScenarioManager(this);
    this.tileManager = new TileManager(TILES_SIZE);
    this.transition = new Fade(FADING_TIME);
    this.mainMenu = new MainMenu(this);
    this.dialogBox = new DialogBox(this);
    this.input = new InputManager();
    this.choiceMenu = null;
    this.currentScreen = null;
    this.mapNameWindow = null;
    this.save = null;
    this.pokemonViewer = null;
    this.activeNpc = null;
    this.dialogCallback = null;
    this.isSaveCompleted = false;
    this.isAttemptSave = false;
    this.isPaused = false;
    this.isBattleMod = false;
    this.init();
    // this.openTitleScreen();
  }

  init() {
    this.tileManager.load();

    animate(this, this.tileManager);
  }

  togglePause(isPaused, isCanMove) {
    this.isPaused = isPaused;
    this.player.isCanMove = isCanMove;
    this.mapManager.currentMap.npcs.forEach(
      (npc) => (npc.isCanMove = isCanMove)
    );
  }

  openDialogBox(text, dialogTree, callbackFn) {
    this.dialogBox.open(text, false);
    this.state = "DIALOG";
    this.togglePause(true, false);
    if (dialogTree) this.openChoiceMenu(dialogTree);
    if (callbackFn) this.dialogCallback = callbackFn;
  }

  closeDialogBox() {
    this.dialogBox.close();
    if (this.activeNpc) this.activeNpc = null;
    this.state = "WORLD";
    this.togglePause(false, true);

    if (this.dialogCallback) {
      const cb = this.dialogCallback;
      this.dialogCallback = null;
      cb();
    }
  }

  openTitleScreen() {
    this.currentScreen = new TitleScreen(this);
    this.currentScreen.open();
    this.state = "TITLE";
  }

  closeTitleScreen() {
    this.currentScreen.close();
    this.state = "WORLD";
    this.togglePause(false, true);
  }

  openMenu() {
    this.mainMenu.open();
    this.state = "MENU";
    this.togglePause(true, false);
  }

  closeMenu() {
    this.mainMenu.close();
    this.state = "WORLD";
    this.togglePause(false, true);
  }

  openChoiceMenu(source) {
    this.choiceMenu = new ChoiceMenu(this, source);
    this.choiceMenu.open();
    this.state = "CHOICE_MENU";
  }

  closeChoiceMenu() {
    this.choiceMenu.close();
    this.choiceMenu = null;
    this.state = "WORLD";
    this.togglePause(false, true);
  }

  start() {
    this.openDialogBox(
      DIALOGS_TREE_DATABASE.newGame.start.text,
      DIALOGS_TREE_DATABASE.newGame
    );
  }

  attemptSave() {
    this.isAttemptSave = true;
    this.save = new Save(this);
    this.openDialogBox(
      DIALOGS_TREE_DATABASE.saveSystem.start.text,
      DIALOGS_TREE_DATABASE.saveSystem
    );
  }

  openPokedex() {
    this.currentScreen = this.player.pokedex;
    this.player.pokedex.open();
    this.state = "POKEDEX";
  }

  closeCurrentScreen() {
    this.currentScreen.close();
  }

  openTeam() {
    this.currentScreen = this.player.team;
  }

  openInventory() {
    console.log(this.player.pokedex);
    this.currentScreen = this.player.inventory;
    this.player.inventory.open();
    this.state = "INVENTORY";
  }

  load() {
    loadGame(this);
  }

  resetCurrentScreen() {
    this.currentScreen = null;
  }

  resetSaveCompleted() {
    this.isSaveCompleted = false;
    this.isAttemptSave = false;
  }

  openWorldMap() {
    startTransitionBeforeOpenWorldMap(this);
  }

  closeWorldMap() {
    const worldMap = this.currentScreen;
    switch (worldMap.mod) {
      case "ENCOUNTER":
        this.openPokedex();
        break;
      case "FLY":
        break;
      case "PLAYER_POSITION":
        break;
      default:
        break;
    }
  }

  openPokemonDetail() {
    const detailPage = this.currentScreen.pokemonList.pokemonDetail;
    detailPage.open();
  }

  handleMenuSelection(itemId, source) {
    dispatchMenuSelection(this, itemId, source);
  }
}
