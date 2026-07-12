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
import { dispatchMenuSelection } from "../../logic/gameplay/game/dispatchMenuSelection.gameplay.js";
import { closeWorldMap } from "../../logic/gameplay/game/worldMap/closeWorldMap.gameplay.js";
import { closeDialogBox } from "../../logic/gameplay/game/dialogBox/closeDialogBox.gameplay.js";
import { openDialogBox } from "../../logic/gameplay/game/dialogBox/openDialogBox.gameplay.js";
import { attemptSave } from "../../logic/gameplay/game/attemptSave.gameplay.js";
import { selectGender } from "../../logic/gameplay/game/selectGender.gameplay.js";
import { togglePause } from "../../logic/gameplay/game/togglePause.gameplay.js";
import { WeatherManager } from "../weather/WeatherManager/WeatherManager.model.js";
import { StartGameMenu } from "../StartGameMenu/StartGameMenu.model.js";
import { GenderMenu } from "../GenderMenu/GenderMenu.model.js";
import { EncounterManager } from "../EncounterManager/encounterManager.model.js";
import { BattleManager } from "../battle/BattleManager/BattleManager.model.js";
import { BattleMenu } from "../battle/BattleManager/BattleMenu/BattleMenu.model.js";
import { handlerClosesFromReturnItem } from "../../logic/gameplay/game/handlerClosesFromReturnItem.gameplay.js";
import { WorldMap } from "../MainMenu/items/pokedex/sections/WorldMap/WorldMap.model.js";
import { BattleMovesMenu } from "../battle/BattleManager/BattleMenu/BattleMovesMenu/BattleMovesMenu.model.js";
import { ScreenManager } from "../ScreenManager/ScreenManager.model.js";
import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";
import { dispatchItemsSelection } from "../../logic/gameplay/items/dispatchItemsSelection.gameplay.js";

export class Game {
  constructor() {
    this.state = GAME_STATES.WORLD;
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
    this.worldMap = new WorldMap(this, "ENCOUNTER");
    this.battleMenu = new BattleMenu(this);
    this.screenManager = new ScreenManager(this);
    this.battleManager = null;
    this.choiceMenu = null;
    this.save = null;
    this.activeNpc = null;
    this.dialogCallback = null;
    this.isAttemptSave = false;
    this.isSaveCompleted = false;
    this.isPaused = false;
    this.init();
    this.openStartMenu();
  }

  init() {
    this.tileManager.load();

    animate(this, this.tileManager);
  }

  switchPokemon() {
    if (this.battleManager) this.battleManager.requestSwitch();
  }

  openStartMenu() {
    this.screenManager.open(new StartGameMenu(this), GAME_STATES.START_GAME);
  }

  openBattle(wildPokemon, tile, battleType) {
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

  playerWantQuitBattle() {
    if (this.battleManager.wildPokemon)
      this.battleManager.hasPlayerEscaped = true;
  }

  stopWildBattle() {
    this.transition.start(
      () => {
        this.togglePause(false, true);
      },
      (done) => {
        this.screenManager.close(GAME_STATES.WORLD);
        this.battleMenu.resetCurrentIndex();
        this.battleManager = null;
        done();
      },
      () => {}
    );
  }

  openBattleWhitoutBattleMenu(item) {
    this.screenManager.setCurrentScreen(this.battleManager);
    this.battleManager.usedItem = item;
    this.battleManager.isUseItem = true;
  }

  openGenderMenu() {
    this.screenManager.open(new GenderMenu(this), GAME_STATES.GENDER_MENU);
  }

  openPokedex() {
    this.screenManager.open(this.player.pokedex, GAME_STATES.POKEDEX);
  }

  openParty() {
    const playerParty = this.player.party;
    playerParty.contextMenu = null;
    this.screenManager.open(playerParty, GAME_STATES.PARTY);
  }

  openPokemonSummary() {
    this.screenManager.open(
      this.player.party.contextMenu.pokemonSummary,
      GAME_STATES.PARTY_SUMMARY
    );
  }

  openPokemonDetail() {
    const detailPage =
      this.screenManager.currentScreen.pokemonList.pokemonDetail;
    detailPage.open();
  }

  openEvolution() {
    this.screenManager.open(
      this.player.party.partyPhaseManager.evolutionSequence,
      GAME_STATES.EVOLUTION
    );
  }

  openInventory() {
    this.screenManager.open(this.player.inventory, GAME_STATES.INVENTORY);
  }

  openWorldMap() {
    const pokemon =
      this.screenManager.currentScreen.pokemonList.selectedPokemon;

    this.screenManager.setCurrentScreen(this.worldMap);
    this.screenManager.currentScreen.open(pokemon);
    this.state = GAME_STATES.WORLDMAP;
  }

  openBattleAttacksMenu() {
    this.battleMovesMenu = new BattleMovesMenu(this);
    this.battleMovesMenu.open();
    this.state = GAME_STATES.BATTLE_ATTACKS_MENU;
  }

  openBattleMenu() {
    this.battleMenu.open();
    this.state = GAME_STATES.BATTLE_MENU;
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

  openDialogBox(text, dialogTree, callbackFn) {
    openDialogBox(text, dialogTree, callbackFn, this);
  }

  closeDialogBox() {
    closeDialogBox(this);
  }

  closeStartMenu() {
    this.screenManager.close(GAME_STATES.WORLD);
    this.togglePause(false, true);
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

  closeWorldMap() {
    closeWorldMap();
  }

  closeAndReturnFromSubMenu() {
    this.screenManager.close();

    if (this.battleManager) {
      this.screenManager.setCurrentScreen(this.battleManager);
      this.openBattleMenu();
    } else this.openPlayerMenu();
  }

  handlerClosesFromReturnItem() {
    handlerClosesFromReturnItem(this);
  }

  load() {
    loadGame(this);
  }

  selectGender(genderId) {
    selectGender(this, genderId);
  }

  attemptSave() {
    attemptSave(this);
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

  startNewGame() {
    this.screenManager.close();
    this.openGenderMenu();
  }

  togglePause(isPaused, isCanMove) {
    togglePause(isPaused, isCanMove, this);
  }

  handleBattleMoves(playerPokemonSelectedMoveData) {
    console.log(playerPokemonSelectedMoveData);
  }
}
