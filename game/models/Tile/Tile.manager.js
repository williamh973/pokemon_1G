import { TILESETS } from "../../shareds/tilesets/tilesets.js";
import { TILES_SIZE } from "../../shareds/utils.js";
import { drawDebugCollisionSquare } from "../../shareds/utils.js";

export class TileManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.images = {};
  }

  load() {
    Object.entries(TILESETS).forEach(([id, tile]) => {
      const img = new Image();
      img.src = tile.src;
      this.images[id] = img;
    });
  }

  getImage(tileId) {
    return this.images[tileId];
  }

  drawMap(ctx, layout, cameraPosX, cameraPosY) {
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        const tileId = layout[y][x];
        const img = this.getImage(tileId);

        if (!img) continue;

        const tile = {
          position: {
            x: x * this.tileSize + cameraPosX,
            y: y * this.tileSize + cameraPosY,
          },
          width: TILES_SIZE,
          height: TILES_SIZE,
        };

        ctx.drawImage(
          img,
          tile.position.x,
          tile.position.y,
          tile.width,
          tile.height
        );

        drawDebugCollisionSquare(tile, ctx, true);
      }
    }
  }
}
