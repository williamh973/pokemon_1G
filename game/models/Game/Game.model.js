import { animate } from "../../render/animate.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { MapManager } from "../Map/MapManager.model.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { MainMenu } from "../MainMenu/MainMenu.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { TitleScreen } from "../TitleScreen/TitleScreen.model.js";
import { MAPS_DATABASE } from "../../shareds/map/maps.database.js";
import { ChoiceMenu } from "../ChoiceMenu/ChoiceMenu.model.js";
import { loadGame } from "../../logic/gameplay/game/loadGame.gameplay.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { FADING_TIME } from "../../shareds/utils/fade/fade.assets.js";
import { Player } from "../Character/Player/Player.model.js";
import { ScenarioManager } from "../ScenarioManager/ScenarioManager.model.js";
import { GAME_FLAGS_DATABASE } from "../../shareds/flags/flags.database.js";
import { TRIGGERED_SCENARIOS_DATABASE } from "../../shareds/scenarios/triggeredScenarios.database.js";
import { MapNameWindow } from "../Map/MapNameWindow.model.js";
import { DayNightCycle } from "../DayNightCycle/DayNightCycle.model.js";
import { TimeManager } from "../TimeManager/TimeManager.model.js";
import { EncounterManager } from "../encounterManager/encounterManager.model.js";
import { dispatchMenuSelection } from "../../logic/gameplay/game/dispatchMenuSelection.gameplay.js";
import { startTransitionBeforeOpenWorldMap } from "../../logic/gameplay/game/worldMap/startTransitionBeforeOpenWorldMap.gameplay.js";
import { closeWorldMap } from "../../logic/gameplay/game/worldMap/closeWorldMap.gameplay.js";
import { closeDialogBox } from "../../logic/gameplay/game/dialogBox/closeDialogBox.gameplay.js";
import { openDialogBox } from "../../logic/gameplay/game/dialogBox/openDialogBox.gameplay.js";
import { attemptSave } from "../../logic/gameplay/game/attemptSave.gameplay.js";
import { selectGender } from "../../logic/gameplay/game/selectGender.gameplay.js";
import { togglePause } from "../../logic/gameplay/game/togglePause.gameplay.js";
import { WeatherManager } from "../weather/WeatherManager/WeatherManager.model.js";

export class Game {
  constructor() {
    this.state = "WORLD";
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.playedWith = "red";
    this.player = new Player(this, this.playedWith);
    this.flags = GAME_FLAGS_DATABASE;
    this.mapManager = new MapManager(this, MAPS_DATABASE);
    this.scenarioManager = new ScenarioManager(this);
    this.triggeredScenarios = TRIGGERED_SCENARIOS_DATABASE;
    this.tileManager = new TileManager(TILES_SIZE);
    this.transition = new Fade(FADING_TIME);
    this.mainMenu = new MainMenu(this);
    this.dialogBox = new DialogBox(this);
    this.input = new InputManager();
    this.weatherManager = new WeatherManager(this);
    this.timeManager = new TimeManager();
    this.dayNightCycle = new DayNightCycle();
    this.encounterManager = new EncounterManager();
    this.mapNameWindow = new MapNameWindow(this);
    this.battleManager = null;
    this.choiceMenu = null;
    this.currentScreen = null;
    this.save = null;
    this.pokemonViewer = null;
    this.activeNpc = null;
    this.dialogCallback = null;
    this.isAttemptSave = false;
    this.isSaveCompleted = false;
    this.isPaused = false;
    this.isBattleMod = false;
    this.init();
    this.openTitleScreen();
  }

  init() {
    this.tileManager.load();
    animate(this, this.tileManager);
  }

  activateBattleState() {
    this.currentScreen = this.battleManager;
    this.currentScreen.open();
    this.state = "BATTLE";
  }

  togglePause(isPaused, isCanMove) {
    togglePause(isPaused, isCanMove, this);
  }

  openDialogBox(text, dialogTree, callbackFn) {
    openDialogBox(text, dialogTree, callbackFn, this);
  }

  closeDialogBox() {
    closeDialogBox(this);
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
    this.selectGender();
  }

  load() {
    loadGame(this);
  }

  selectGender() {
    selectGender(this);
  }

  attemptSave() {
    attemptSave(this);
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
    this.currentScreen = this.player.inventory;
    this.player.inventory.open();
    this.state = "INVENTORY";
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
    closeWorldMap();
  }

  openPokemonDetail() {
    const detailPage = this.currentScreen.pokemonList.pokemonDetail;
    detailPage.open();
  }

  handleMenuSelection(itemId, source) {
    dispatchMenuSelection(this, itemId, source);
  }
}
