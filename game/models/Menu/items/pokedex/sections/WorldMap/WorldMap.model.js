import { drawBox } from "../../../../../../shareds/utils.js";
import { WORLDMAP_GRID } from "../../../../../../shareds/worldMap/worldMap.js";

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
    this.selectedPokemon = null;
    this.hasFocus = false;
    this.isOpen = true;
    this.images = {};

    this.loadTiles();
  }

  loadTiles() {
    for (let x = 0; x < WORLDMAP_GRID.width; x++) {
      for (let y = 0; y < WORLDMAP_GRID.height; y++) {
        const key = `${x},${y}`;
        const img = new Image();
        img.src = `${WORLDMAP_GRID.basePath}world_X${x}_Y${y}.png`;
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

    for (let x = 0; x < WORLDMAP_GRID.width; x++) {
      for (let y = 0; y < WORLDMAP_GRID.height; y++) {
        const key = `${x},${y}`;
        const img = this.images[key];

        if (!img) continue;

        context.drawImage(
          img,
          this.position.x + x * WORLDMAP_GRID.tileSize,
          this.position.y + y * WORLDMAP_GRID.tileSize,
          WORLDMAP_GRID.tileSize,
          WORLDMAP_GRID.tileSize
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
    context.fillText(
      `NID DE ${this.selectedPokemon.name}`,
      this.game.canvas.width / 4,
      16 / 2
    );

    context.strokeStyle = "red";
    for (const area of this.selectedPokemon.worldMap)
      this.drawRect(context, area);
  }

  drawRect(context, area) {
    const scale = WORLDMAP_GRID.scale;
    context.strokeRect(
      area.x * WORLDMAP_GRID.tileSize,
      area.y * WORLDMAP_GRID.tileSize,
      area.w * WORLDMAP_GRID.tileSize * scale,
      area.h * WORLDMAP_GRID.tileSize * scale
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

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
