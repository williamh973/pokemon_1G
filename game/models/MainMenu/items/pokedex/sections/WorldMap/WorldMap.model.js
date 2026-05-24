import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { WORLDMAP_SETTING } from "../../../../../../shareds/worldMap/worldMap.setting.js";

export class WorldMap {
  constructor(game, mod) {
    this.game = game;
    this.name = "worldMap";
    this.possibleMod = "ENCOUNTER" | "FLY" | "PLAYER_POSITION";
    this.mod = mod;
    this.position = {
      x: 0,
      y: 0,
    };
    this.scale = WORLDMAP_SETTING.scale;
    this.selectedPokemon = null;
    this.hasFocus = false;
    this.isOpen = false;
    this.images = {};
    this.blinkTimer = 0;
    this.blinkVisible = true;

    this.loadTiles();
  }

  loadTiles() {
    for (let x = 0; x < WORLDMAP_SETTING.width; x++) {
      for (let y = 0; y < WORLDMAP_SETTING.height; y++) {
        const key = `${x},${y}`;
        const img = new Image();
        img.src = `${WORLDMAP_SETTING.basePath}world_X${x}_Y${y}.png`;
        this.images[key] = img;
      }
    }
  }

  draw(context) {
    if (!this.isOpen) return;

    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.game.canvas.width,
      this.game.canvas.height,
      "black",
      "black"
    );

    for (let x = 0; x < WORLDMAP_SETTING.width; x++) {
      for (let y = 0; y < WORLDMAP_SETTING.height; y++) {
        const key = `${x},${y}`;
        const img = this.images[key];

        if (!img) continue;

        context.drawImage(
          img,
          this.position.x + x * WORLDMAP_SETTING.tileSize,
          this.position.y + y * WORLDMAP_SETTING.tileSize,
          WORLDMAP_SETTING.tileSize,
          WORLDMAP_SETTING.tileSize
        );
      }
    }

    switch (this.mod) {
      case "ENCOUNTER":
        this.showSelectedPokemonAreas(context);
        break;

      default:
        break;
    }
  }

  showSelectedPokemonAreas(context) {
    context.fillStyle = "white";
    drawText(
      context,
      `NID DE ${this.selectedPokemon.name}`,
      this.game.canvas.width / 4,
      16 / 2
    );

    if (!this.blinkVisible) return;
    for (const area of this.selectedPokemon.worldMap)
      this.drawOverlays(context, area);
  }

  drawOverlays(context, area) {
    context.fillStyle = "rgba(255, 0, 0, 0.55)";
    context.fillRect(
      area.x * WORLDMAP_SETTING.tileSize,
      area.y * WORLDMAP_SETTING.tileSize,
      (area.w * WORLDMAP_SETTING.tileSize) / 2,
      (area.h * WORLDMAP_SETTING.tileSize) / 2
    );
  }

  open(pokemon) {
    this.selectedPokemon = pokemon;
    this.isOpen = true;
    this.hasFocus = true;
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;
  }

  update(game, action) {
    if (!this.isOpen) return;

    this.blinkTimer++;
    if (this.blinkTimer % 30 === 0) this.blinkVisible = !this.blinkVisible;

    this.draw(game.canvas.context);

    if (!this.hasFocus) return;

    switch (action) {
      case "ESCAPE":
        this.close();
        game.closeWorldMap();
        break;

      default:
        break;
    }
  }
}
