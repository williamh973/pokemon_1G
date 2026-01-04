import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { TileManager } from "../Tile/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { TILES_SIZE } from "../../shareds/utils.js";
import { palletTown } from "../../logic/gameplay/maps/palletTown/palletTown.data.js";
import { MapManager } from "../Map/MapManager.model.js";
import { MAPS } from "../../logic/gameplay/maps/maps.registry.js";
import { Fade } from "../Fade/fade.model.js";
import { keys } from "../../logic/gameplay/player/keyboard.js";
import { DialogBox } from "../dialogBox/dialogBox.model.js";
import { Menu } from "../Menu/Menu.model.js";

export class Game {
  constructor() {
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.player = new Player();
    this.mapManager = new MapManager(this, MAPS);
    this.tileManager = new TileManager(TILES_SIZE);
    this.transition = new Fade(10);
    this.menu = new Menu(this.canvas);
    this.selectionScreens = [];
    this.dialogBox = null;
    this.mapNameWindow = null;
    this.isPaused = false;
    this.hasStarted = false;
    this.isFightMod = false;
    this.currentMap = palletTown;
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

  showDialog(text) {
    if (this.dialogBox?.isOpen) return;
    this.togglePause(true, false);
    this.dialogBox = new DialogBox(this.canvas, text, false);
    this.dialogBox.open();
  }

  closeDialog() {
    this.dialogBox = null;
    this.togglePause(false, true);
  }

  showMenu() {
    this.menu.isOpen = !this.menu.isOpen;
    this.menu.isOpen
      ? this.togglePause(true, false)
      : this.togglePause(false, true);
  }
}
