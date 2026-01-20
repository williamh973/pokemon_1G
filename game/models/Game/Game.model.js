import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../Tile/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { FADING_TIME, TILES_SIZE } from "../../shareds/utils.js";
import { palletTown } from "../../logic/gameplay/maps/palletTown/palletTown.data.js";
import { MapManager } from "../Map/MapManager.model.js";
import { MAPS } from "../../logic/gameplay/maps/maps.registry.js";
import { Fade } from "../Fade/fade.model.js";
import { DialogBox } from "../DialogBox/dialogBox.model.js";
import { Menu } from "../Menu/Menu.model.js";
import { Pokedex } from "../Menu/items/pokedex/pokedex.model.js";
import { keys } from "../../logic/gameplay/player/keyboard.js";
import { WorldMap } from "../Menu/items/pokedex/sections/WorldMap/WorldMap.model.js";
import { KANTO_ROUTE_1 } from "../../logic/gameplay/maps/kanto/kantoRoute1/kantoRoute1.data.js";

export class Game {
  constructor() {
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.player = new Player();
    this.mapManager = new MapManager(this, MAPS);
    this.tileManager = new TileManager(TILES_SIZE);
    this.transition = new Fade(FADING_TIME);
    this.menu = new Menu(this);
    this.currentMap = palletTown;
    this.currentScreen = null;
    this.dialogBox = null;
    this.mapNameWindow = null;
    this.isPaused = false;
    this.hasStarted = false;
    this.isBattleMod = false;
    this.init();
  }

  init() {
    this.tileManager.load();

    animate(this, this.tileManager);
    this.hasStarted = true;
  }

  togglePause(isPaused, isCanMove) {
    this.isPaused = isPaused;
    this.player.isCanMove = isCanMove;
  }

  openMenu() {
    this.menu.open();
    this.togglePause(true, false);
  }

  closeMenu() {
    this.menu.close();
    this.togglePause(false, true);
  }

  openDialogBox(text, height) {
    this.dialogBox = new DialogBox(this, text, true, height);
    this.togglePause(true, false);
    keys.action = false;
  }

  closeDialogBox() {
    this.dialogBox = null;
    this.togglePause(false, true);
  }

  openPokedex() {
    this.menu.hasFocus = false;
    this.currentScreen = new Pokedex(this);
  }

  resetCurrentScreen() {
    this.currentScreen = null;
  }

  openPokemonEncounters() {
    this.transition.start(
      () => {
        const pokemon = this.currentScreen.pokemonList.selectedPokemon;
        this.currentScreen = new WorldMap(this, "encounters");
        this.currentScreen.open(pokemon);
        this.menu.close();
      },
      () => {}
    );
  }

  openPokemonDetail() {
    const detailPage = this.currentScreen.pokemonList.pokemonDetail;
    detailPage.open();
    this.openDialogBox(detailPage.pokemon.desc);
  }

  showMenuSelectedItem(itemId) {
    const mainMenu = {
      POKEDEX: () => this.openPokedex(),
      POKEMON: () => this.openTeam(),
      SAC: () => this.openBag(),
      OPTIONS: () => this.openOptions(),
      RETOUR: () => this.closeMenu(),
    };

    const pokedexCharacMenu = {
      INFO: () => this.openPokemonDetail(),
      CRI: () => this(),
      ZONE: () => this.openPokemonEncounters(),
      RETOUR: () => this.menu.open(),
    };

    if (this.menu.isOpen) mainMenu[itemId]?.();
    if (this.currentScreen.pokedexCharac.isOpen) pokedexCharacMenu[itemId]?.();
  }
}
