import { TERRAIN_EXT } from "../../shareds/tilesets/world/terrain/exterior/terrainExt.js";
import { drawDebugCollisionSquare } from "../../shareds/utils.js";
import { OAKLAB } from "../../shareds/tilesets/world/building/oak_labo/oakLab.js";
import { PROPS } from "../../shareds/tilesets/world/props/props.js";
import { RED_HOUSE } from "../../shareds/tilesets/world/building/house/redHouse/ext/redHouse.js";

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
    const allTilesets = {
      ...TERRAIN_EXT,
      ...RED_HOUSE,
      ...OAKLAB,
      ...PROPS,
    };

    this.tilesets = allTilesets;

    Object.entries(allTilesets).forEach(([id, tile]) => {
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
        const tileData = this.tilesets[tileId];

        if (!img) continue;

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

        ctx.drawImage(img, sx, 0, 16, 16, dx, dy, this.tileSize, this.tileSize);

        drawDebugCollisionSquare(tile, ctx, true);
      }
    }
  }
}
