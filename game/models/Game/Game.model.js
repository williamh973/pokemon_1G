import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../TileManager/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { FADING_TIME, TILES_SIZE } from "../../shareds/utils.js";
import { palletTown } from "../../logic/gameplay/maps/palletTown/palletTown.data.js";
import { MapManager } from "../Map/MapManager.model.js";
import { MAPS } from "../../logic/gameplay/maps/maps.registry.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { Menu } from "../Menu/Menu.model.js";
import { Pokedex } from "../Menu/items/pokedex/pokedex.model.js";
import { WorldMap } from "../Menu/items/pokedex/sections/WorldMap/WorldMap.model.js";
import { InputManager } from "../InputManager/InputManager.model.js";
import { Save } from "../Menu/items/Save/save.model.js";
import { TitleScreen } from "../TitleScreen/TitleScreen.model.js";
import { redHouse1F } from "../../logic/gameplay/maps/palletTown/redHouse/1F/redHouse.data.js";

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
    this.currentMap = redHouse1F;
    this.currentScreen = null;
    this.mapNameWindow = null;
    this.isPaused = false;
    this.isBattleMod = false;
    this.isLoaded = false;
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

  openDialogBox(text) {
    this.dialogBox.open(text, false);
    this.state = "DIALOG";
    this.togglePause(true, false);
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

  save() {
    const save = new Save();
    save.capture(this);
    save.write();
    this.closeMenu();
  }

  load() {
    const save = Save.load();
    if (!save) return;

    save.apply(this);
    this.isLoaded = true;
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
      SAUVER: () => this.save(),
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
