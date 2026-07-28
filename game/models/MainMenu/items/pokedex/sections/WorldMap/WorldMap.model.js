import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { WORLDMAP_CONFIG } from "../../../../../../render/config/worldMap/worldMap.config.js";
import { idlePlayerDown } from "../../../../../../assets/images/player/player.assets.js";
import { bikeIdlePlayerDown } from "../../../../../../assets/images/player/player.assets.js";
import { WORLDMAP_STATES } from "../../../../../../logic/gameplay/worldMap/worldMap.states.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";

export class WorldMap {
  constructor(game) {
    this.game = game;
    this.possiblePlayerImages = {
      idleDown: idlePlayerDown,
      bikeIdleDown: bikeIdlePlayerDown,
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.scale = WORLDMAP_CONFIG.scale;
    this.state = null;
    this.selectedPokemon = null;
    this.hasFocus = false;
    this.isOpen = false;
    this.images = {};
    this.blinkTimer = 0;
    this.blinkOpacity = 0;
    this.isPlayerVisible = true;
    this.usedItem = null;

    this.loadTiles();
  }

  loadTiles() {
    for (let x = 0; x < WORLDMAP_CONFIG.width; x++) {
      for (let y = 0; y < WORLDMAP_CONFIG.height; y++) {
        const key = `${x},${y}`;
        const img = new Image();
        img.src = `${WORLDMAP_CONFIG.basePath}world_X${x}_Y${y}.png`;
        this.images[key] = img;
      }
    }
  }

  drawBackgImage(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.game.canvas.width,
      this.game.canvas.height,
      "black",
      "black"
    );
  }

  drawWorldMap(context) {
    for (let x = 0; x < WORLDMAP_CONFIG.width; x++) {
      for (let y = 0; y < WORLDMAP_CONFIG.height; y++) {
        const key = `${x},${y}`;
        const img = this.images[key];

        if (!img) continue;

        context.drawImage(
          img,
          this.position.x + x * WORLDMAP_CONFIG.tileSize,
          this.position.y + y * WORLDMAP_CONFIG.tileSize,
          WORLDMAP_CONFIG.tileSize,
          WORLDMAP_CONFIG.tileSize
        );
      }
    }
  }

  draw(context) {
    if (!this.isOpen) return;

    this.drawBackgImage(context);

    this.drawWorldMap(context);
  }

  drawInfos(context, weight, color) {
    const map = this.game.mapManager.currentMap;
    const text = this.selectedPokemon
      ? `Repère de ${this.selectedPokemon.name}`
      : `Vous êtes à ${map.name}`;

    textParams(context, weight, color);
    drawText(context, text, 16, 4);
  }

  showSelectedPokemonAreas(context) {
    this.drawInfos(context, "21", "rgb(255, 255, 255, 0.9)");

    for (const area of this.selectedPokemon.worldMap)
      this.drawOverlays(context, area.pokemonNest);
  }

  showPlayer(context) {
    this.drawInfos(context, "20", "rgb(255, 255, 255, 0.9)");

    if (!this.isPlayerVisible) return;

    const MAP = this.game.mapManager.currentMap;
    const MAP_COORDS = {
      x: MAP.worldMap.playerPosition.x * WORLDMAP_CONFIG.tileSize,
      y: MAP.worldMap.playerPosition.y * WORLDMAP_CONFIG.tileSize,
    };

    const playerSprite = this.game.player.isOnBike
      ? this.possiblePlayerImages.bikeIdleDown
      : this.possiblePlayerImages.idleDown;

    context.drawImage(
      playerSprite,
      MAP_COORDS.x,
      MAP_COORDS.y,
      playerSprite.width,
      playerSprite.height
    );
  }

  drawOverlays(context, area) {
    context.fillStyle = `rgba(255, 0, 0, ${this.blinkOpacity})`;
    context.fillRect(
      area.x * WORLDMAP_CONFIG.tileSize,
      area.y * WORLDMAP_CONFIG.tileSize,
      (area.w * WORLDMAP_CONFIG.tileSize) / 2, // area contient les coordonnées de la map :   export const palletTownWorldMap = {   pokemonNest: { x: 3, y: 7.5, w: 1, h: 1 },  playerPosition: { x: 2.95, y: 7.4 },};

      (area.h * WORLDMAP_CONFIG.tileSize) / 2
    );
  }

  open(selectedPokemonFromPokedex = null, item = null) {
    this.selectedPokemon = null;
    this.usedItem = null;

    if (selectedPokemonFromPokedex) {
      this.state = WORLDMAP_STATES.ENCOUNTER;
      this.selectedPokemon = selectedPokemonFromPokedex;
    }

    if (item) {
      this.state = WORLDMAP_STATES.PLAYER_POSITION;
      this.usedItem = item;
    }

    this.isOpen = true;
    this.hasFocus = true;
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;

    this.redirectTo();
  }

  redirectTo() {
    if (this.state === WORLDMAP_STATES.ENCOUNTER) this.game.openPokedex();
    else this.game.openPlayerMenu();
  }

  handlerBlinkForPokemonNests() {
    const blinkProgress = (this.blinkTimer % 60) / 60;

    if (blinkProgress < 0.5) this.blinkOpacity += 0.02;
    else this.blinkOpacity -= 0.02;
  }

  handlerBlinkForPlayerPosition() {
    if (this.blinkTimer % 30 === 0)
      this.isPlayerVisible = !this.isPlayerVisible;
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.blinkTimer++;
    this.handlerBlinkForPokemonNests();

    this.handlerBlinkForPlayerPosition();

    this.draw(context);

    switch (this.state) {
      case WORLDMAP_STATES.ENCOUNTER:
        this.showSelectedPokemonAreas(context);
        break;
      case WORLDMAP_STATES.PLAYER_POSITION:
        this.showPlayer(context);
        break;

      default:
        break;
    }

    if (!this.hasFocus) return;

    switch (action) {
      case "ESCAPE":
        this.close();
        break;

      default:
        break;
    }
  }
}
