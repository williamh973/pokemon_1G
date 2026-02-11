import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { MapManager } from "../Map/MapManager.model.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { Menu } from "../Menu/Menu.model.js";
import { Pokedex } from "../Menu/items/pokedex/pokedex.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { Save } from "../Menu/items/Save/save.model.js";
import { TitleScreen } from "../TitleScreen/TitleScreen.model.js";
import { MAPS } from "../../shareds/map/maps.registry.js";
import { ChoiceMenu } from "../ChoiceMenu/ChoiceMenu.model.js";
import { redHouse_2F } from "../../shareds/map/kanto/palletTown/redHouse/2F/redHouse2F.data.js";
import { DIALOGS_TREE_DATABASE } from "../../shareds/dialogTree/dialogTree.database.js";
import { Inventory } from "../Inventory/Inventory.model.js";
import {
  dispatchMenuSelection,
  loadGame,
  startTransitionBeforeOpenWorldMap,
} from "../../logic/gameplay/game/game.gameplay.js";
import { GAME_FLAGS } from "../../shareds/utils/game/game.utils.js";
import { redHouse_1F } from "../../shareds/map/kanto/palletTown/redHouse/1F/redHouse1F.data.js";
import { palletTown } from "../../shareds/map/kanto/palletTown/palletTown.data.js";
import { kantoRoute1 } from "../../shareds/map/kanto/kantoRoute1/kantoRoute1.data.js";
import { oakLab } from "../../shareds/map/kanto/palletTown/oakLab/oakLab.data.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { FADING_TIME } from "../../shareds/utils/fade/fade.assets.js";

export class Game {
  constructor() {
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.player = new Player();
    this.mapManager = new MapManager(this, MAPS);
    this.tileManager = new TileManager(TILES_SIZE);
    this.transition = new Fade(FADING_TIME);
    this.menu = new Menu(this);
    this.dialogBox = new DialogBox(this);
    this.input = new InputManager();
    this.inventory = new Inventory(this);
    this.state = "WORLD";
    this.currentMap = redHouse_2F;
    this.flags = GAME_FLAGS;
    this.choiceMenu = null;
    this.currentScreen = null;
    this.mapNameWindow = null;
    this.save = null;
    this.isPaused = false;
    this.isBattleMod = false;
    this.isLoaded = false;
    this.init();
    this.openTitleScreen();
  }

  init() {
    this.tileManager.load();

    animate(this, this.tileManager);
  }

  togglePause(isPaused, isCanMove) {
    this.isPaused = isPaused;
    this.player.isCanMove = isCanMove;
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
    this.menu.open();
    this.state = "MENU";
    this.togglePause(true, false);
  }

  closeMenu() {
    this.menu.close();
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
    this.state = "WORLD";
    this.togglePause(false, true);
  }

  attemptSave() {
    this.save = new Save();
    this.openDialogBox(
      DIALOGS_TREE_DATABASE.saveSystem.start.text,
      DIALOGS_TREE_DATABASE.saveSystem
    );
  }

  openDialogBox(text, source) {
    this.dialogBox.open(text, false);
    this.state = "DIALOG";

    if (!source) return;
    this.openChoiceMenu(source);
  }

  closeDialogBox() {
    this.dialogBox.close();
    this.state = "WORLD";
    requestAnimationFrame(() => this.togglePause(false, true));
  }

  openPokedex() {
    this.currentScreen = new Pokedex(this);
    this.state = "POKEDEX";
  }

  closeCurrentScreen() {
    this.currentScreen.close();
  }

  openInventory() {
    this.currentScreen = this.inventory;
    this.currentScreen.open();
    this.state = "INVENTORY";
  }

  load() {
    loadGame(this);
  }

  resetCurrentScreen() {
    this.currentScreen = null;
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
