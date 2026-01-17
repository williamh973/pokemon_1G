import { WORLDMAP_GRID } from "../../../../../../shareds/worldMap/worldMap.js";

export class WorldMap {
  constructor(game) {
    this.position = {
      x: 0,
      y: 0,
    };
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
  }
}
