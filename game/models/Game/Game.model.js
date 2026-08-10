import { animate } from "../../render/animate.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { MapManager } from "../Map/MapManager.model.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { MainMenu } from "../MainMenu/MainMenu.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { MAPS_DATABASE } from "../../shareds/map/maps.database.js";
import { ChoiceMenu } from "../ChoiceMenu/ChoiceMenu.model.js";
import { applySaveDatas } from "../../logic/gameplay/game/applySaveDatas.gameplay.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { FADING_TIME } from "../../shareds/utils/fade/fade.assets.js";
import { Player } from "../Character/Player/Player.model.js";
import { ScenarioManager } from "../ScenarioManager/ScenarioManager.model.js";
import { GAME_FLAGS_DATABASE } from "../../shareds/flags/flags.database.js";
import { TRIGGERED_SCENARIOS_DATABASE } from "../../shareds/scenarios/triggeredScenarios.database.js";
import { MapNameWindow } from "../Map/MapNameWindow.model.js";
import { DayNightCycle } from "../DayNightCycle/DayNightCycle.model.js";
import { TimeManager } from "../TimeManager/TimeManager.model.js";
import { dispatchMenuSelection } from "../../logic/gameplay/game/dispatchMenuSelection.gameplay.js";
import { closeDialogBox } from "../../logic/gameplay/game/dialogBox/closeDialogBox.gameplay.js";
import { openDialogBox } from "../../logic/gameplay/game/dialogBox/openDialogBox.gameplay.js";
import { attemptSave } from "../../logic/gameplay/game/attemptSave.gameplay.js";
import { togglePause } from "../../logic/gameplay/game/togglePause.gameplay.js";
import { WeatherManager } from "../weather/WeatherManager/WeatherManager.model.js";
import { EncounterManager } from "../EncounterManager/encounterManager.model.js";
import { BattleManager } from "../battle/BattleManager/BattleManager.model.js";
import { handlerClosesFromReturnItem } from "../../logic/gameplay/game/handlerClosesFromReturnItem.gameplay.js";
import { WorldMap } from "../MainMenu/items/pokedex/sections/WorldMap/WorldMap.model.js";
import { ScreenManager } from "../ScreenManager/ScreenManager.model.js";
import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";
import { dispatchItemsSelection } from "../../logic/gameplay/items/dispatchItemsSelection.gameplay.js";
import { Save } from "../MainMenu/items/Save/save.model.js";
import { GamePhaseManager } from "../IntroManager/IntroManager.model.js";

export class Game {
  constructor() {
    this.tileManager = new TileManager(TILES_SIZE);
    this.tileManager.load();
    this.state = GAME_STATES.START_GAME;
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.flags = GAME_FLAGS_DATABASE;
    this.mapManager = new MapManager(this, MAPS_DATABASE);
    this.scenarioManager = new ScenarioManager(this);
    this.triggeredScenarios = TRIGGERED_SCENARIOS_DATABASE;
    this.transition = new Fade(FADING_TIME);
    this.dialogBox = new DialogBox(this);
    this.input = new InputManager();
    this.weatherManager = new WeatherManager(this);
    this.timeManager = new TimeManager();
    this.dayNightCycle = new DayNightCycle();
    this.encounterManager = new EncounterManager();
    this.screenManager = new ScreenManager(this);
    this.gamePhaseManager = new GamePhaseManager(this);
    this.mapNameWindow = new MapNameWindow(this);
    this.worldMap = new WorldMap(this);
    this.mainMenu = new MainMenu(this);
    this.player = null;
    this.playerGender = "";
    this.battleManager = null;
    this.choiceMenu = null;
    this.save = null;
    this.activeNpc = null;
    this.dialogCallback = null;
    this.isAttemptSave = false;
    this.isSaveCompleted = false;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.gamePhaseManager.setPhase("START_OR_CONTINUE");
    animate(this, this.tileManager);
  }

  startNewGame() {
    this.gamePhaseManager.setPhase("SELECT_GENDER");
  }

  hasPlayerGenderSelected(genderId) {
    this.playerGender = genderId;

    this.gamePhaseManager.setPhase("SELECT_PLAYER_NICKNAME");
  }

  hasPlayerNicknameSelected(nickname) {
    this.createPlayer(nickname);
    this.updateMainMenu();
    this.screenManager.close(GAME_STATES.WORLD);
    this.togglePause(false, true);
  }

  createPlayer(nickname) {
    this.player = new Player(this, this.playerGender, nickname);
  }

  updateMainMenu() {
    this.mainMenu.items.find((item) => item.id === "TRAINER_CARD").name =
      this.player.nickname;
  }

  switchPokemon() {
    if (this.battleManager) this.battleManager.requestSwitch();
  }

  createBattle(wildPokemon, tile, battleType) {
    this.battleManager = new BattleManager(
      this,
      wildPokemon,
      tile,
      this.weatherManager.state,
      battleType
    );
    this.dialogBox.isOpen = true;
    this.screenManager.open(this.battleManager, GAME_STATES.BATTLE);
  }

  load() {
    const save = Save.loadLS();
    if (!save) return;

    this.player = new Player(this, save.player.gender);

    const hasSaveDataApplied = applySaveDatas(this, save);
    if (hasSaveDataApplied) this.screenManager.close(GAME_STATES.WORLD);
  }

  attemptSave() {
    attemptSave(this);
  }

  openBattleWhitoutBattleMenu(item) {
    this.screenManager.setCurrentScreen(this.battleManager);
    this.battleManager.usedItem = item;
    this.battleManager.isUseItem = true;
  }

  openWorldMap(item = null) {
    const selectedPokemonFromPokedex =
      this.screenManager.currentScreen.pokemonList?.selectedPokemon;

    this.screenManager.setCurrentScreen(this.worldMap);

    if (selectedPokemonFromPokedex)
      this.worldMap.open(selectedPokemonFromPokedex);
    else if (item) this.worldMap.open(null, item);

    this.state = GAME_STATES.WORLDMAP;
  }

  openPlayerMenu() {
    this.mainMenu.open();
    this.state = GAME_STATES.PLAYER_MENU;
    this.togglePause(true, false);
  }

  openChoiceMenu(source) {
    this.choiceMenu = new ChoiceMenu(this, source);
    this.choiceMenu.open();
    this.state = GAME_STATES.CHOICE_MENU;
  }

  openDialogBox(text, dialogTree = null, callbackFn = null) {
    openDialogBox(text, dialogTree, callbackFn, this);
  }

  onBattleEnded() {
    this.battleManager = null;
  }

  closeDialogBox() {
    closeDialogBox(this);
  }

  closeChoiceMenu() {
    this.choiceMenu.close();
    this.choiceMenu = null;
    this.state = GAME_STATES.WORLD;
    this.togglePause(false, true);
  }

  closePlayerMenu() {
    this.mainMenu.close();
    this.state = GAME_STATES.WORLD;
    this.togglePause(false, true);
  }

  closeAndReturnFromSubMenu() {
    this.screenManager.close();

    if (this.battleManager) {
      this.screenManager.setCurrentScreen(this.battleManager);
      this.battleManager.openBattleMenu();
    } else this.openPlayerMenu();
  }

  handlerClosesFromReturnItem() {
    handlerClosesFromReturnItem(this);
  }

  resetSaveCompleted() {
    this.isSaveCompleted = false;
    this.isAttemptSave = false;
  }

  handleMenuSelection(itemId, source) {
    dispatchMenuSelection(this, itemId, source);
  }

  handleItemSelection(item, source) {
    dispatchItemsSelection(this, item, source);
  }

  togglePause(isPaused, isCanMove) {
    togglePause(isPaused, isCanMove, this);
  }
}
