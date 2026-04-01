import { drawDebugCollisionSquare } from "../../shareds/utils/tile/tile.utils.js";
import { TILESETS_DATABASE } from "../../shareds/tilesets/tilesets.database.js";

// animation = les secondes qui passent
// frameDuration = combien de secondes tu restes sur une image
// frames = nombre d’images
// % frames = tu reviens au début

export class TileManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.images = {};
    this.tilesets = {};
    this.animation = 0;
  }

  update() {
    this.animation++;
  }

  getAnimatedFrame(tiles) {
    return Math.floor(this.animation / tiles.frameDuration) % tiles.frames;
  }

  load() {
    this.tilesets = TILESETS_DATABASE;

    Object.entries(TILESETS_DATABASE).forEach(([id, tile]) => {
      const img = new Image();
      img.src = tile.src;
      this.images[id] = img;
    });
  }

  getImage(tileId) {
    return this.images[tileId];
  }

  drawMap(context, layout, cameraPosX, cameraPosY, tileType) {
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        const tileId = layout[y][x];
        const img = this.getImage(tileId);
        const tileData = this.tilesets[tileId];

        if (!img) continue;

        const isOverlay = tileData.type === "overlay";
        if (tileType === "background" && isOverlay) continue;
        if (tileType === "overlay" && !isOverlay) continue;

        const tile = {
          position: {
            x: x * this.tileSize + cameraPosX,
            y: y * this.tileSize + cameraPosY,
          },
          width: this.tileSize,
          height: this.tileSize,
        };

        let sx = 0;

        if (tileData.animated) sx = this.getAnimatedFrame(tileData) * 16;

        const dx = x * this.tileSize + cameraPosX;
        const dy = y * this.tileSize + cameraPosY;

        context.drawImage(
          img,
          sx,
          0,
          16,
          16,
          dx,
          dy,
          this.tileSize + 0.5,
          this.tileSize + 0.5
        );

        drawDebugCollisionSquare(tile, context, false);
      }
    }
  }
}
