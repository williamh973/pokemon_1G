import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { FADING_TIME, GAME_FLAGS, TILES_SIZE } from "../../shareds/utils.js";
import { MapManager } from "../Map/MapManager.model.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { Menu } from "../Menu/Menu.model.js";
import { Pokedex } from "../Menu/items/pokedex/pokedex.model.js";
import { WorldMap } from "../Menu/items/pokedex/sections/WorldMap/WorldMap.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { Save } from "../Menu/items/Save/save.model.js";
import { TitleScreen } from "../TitleScreen/TitleScreen.model.js";
import { MAPS } from "../../shareds/map/maps.registry.js";
import { redHouse_1F } from "../../shareds/map/kanto/palletTown/redHouse/1F/redHouse1F.data.js";
import { ChoiceMenu } from "../ChoiceMenu/ChoiceMenu.model.js";
import { palletTown } from "../../shareds/map/kanto/palletTown/palletTown.data.js";
import { kantoRoute1 } from "../../shareds/map/kanto/kantoRoute1/kantoRoute1.data.js";
import { redHouse_2F } from "../../shareds/map/kanto/palletTown/redHouse/2F/redHouse2F.data.js";
import { oakLab } from "../../shareds/map/kanto/palletTown/oakLab/oakLab.data.js";
import { DIALOGS_TREE_DATABASE } from "../../shareds/dialogTree/dialogTree.database.js";

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
    this.togglePause(true, false);

    if (!source) return;
    this.openChoiceMenu(source);
  }

  closeDialogBox() {
    this.dialogBox.close();
    this.state = "WORLD";
    requestAnimationFrame(() => {
      this.togglePause(false, true);
    });
  }

  openPokedex() {
    this.currentScreen = new Pokedex(this);
    this.state = "POKEDEX";
  }

  closePokedex() {
    this.currentScreen.close();
  }

  load() {
    const save = Save.load();
    if (!save) return;

    save.apply(this);
    this.isLoaded = true;
    this.mapManager.loadMap(this.currentMap.id);
    this.closeTitleScreen();
  }

  resetCurrentScreen() {
    this.currentScreen = null;
  }

  openWorldMap() {
    this.transition.start(
      () => {
        const pokemon = this.currentScreen.pokemonList.selectedPokemon;
        this.currentScreen = new WorldMap(this, "ENCOUNTER");
        this.currentScreen.open(pokemon);
        this.state = "WORLDMAP";
        this.menu.close();
      },
      () => {}
    );
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

  showMenuSelectedItem(itemId, source) {
    source.hasFocus = false;
    const mainMenu = {
      POKEDEX: () => this.openPokedex(),
      POKEMON: () => this.openTeam(),
      SAC: () => this.openBag(),
      SAUVER: () => this.attemptSave(),
      OPTIONS: () => this.openOptionsScreen()(),
      RETOUR: () => this.closeMenu(),
    };

    const pokedexCharacMenu = {
      INFO: () => this.openPokemonDetail(),
      CRI: () => this(),
      ZONE: () => this.openWorldMap(),
      RETOUR: () => this.closePokedex(),
    };

    const titleScreenMenu = {
      NEW_GAME: () => this.closeTitleScreen(),
      CONTINUE: () => this.load(),
      OPTIONS: () => this.openOptionsScreen(),
    };

    if (this.menu.isOpen) mainMenu[itemId]?.();
    if (
      this.currentScreen?.name === "POKEDEX" &&
      this.currentScreen?.pokedexCharac.isOpen
    )
      pokedexCharacMenu[itemId]?.();

    if (this.currentScreen?.name === "TITLE" && this.currentScreen?.isOpen)
      titleScreenMenu[itemId]?.();
  }
}
