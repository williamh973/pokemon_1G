import { animate } from "../../render/animate.js";
import { Player } from "../Player/Player.model.js";
import { Canvas } from "../Canvas/Canvas.model.js";
import { palletTownLayout } from "../../logic/gameplay/maps/palletTown/palletTown.layout.js";
import { TileManager } from "../Tile/Tile.manager.js";
import { Camera } from "../Camera/camera.model.js";
import { TILES_SIZE } from "../../shareds/utils.js";
import { palletTown } from "../../logic/gameplay/maps/palletTown/palletTown.data.js";
import { MapManager } from "../Map/MapManager.model.js";
import { MAPS } from "../../logic/gameplay/maps/maps.registry.js";

export class Game {
  constructor() {
    this.canvas = new Canvas(document.getElementById("canvas"));
    this.camera = new Camera(this.canvas);
    this.player = new Player();
    this.mapManager = new MapManager(this, MAPS);
    this.selectionScreens = [];
    this.isPaused = false;
    this.hasStarted = false;
    this.isFightMod = false;
    this.currentMap = palletTown;
    this.init();
  }

  init() {
    const tileManager = new TileManager(TILES_SIZE);
    tileManager.load();

    animate(this, tileManager);
    this.hasStarted = true;
  }
}
