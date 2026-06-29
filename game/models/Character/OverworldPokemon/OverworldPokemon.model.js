import { Character } from "../Character.model.js";

export class OverworldPokemon extends Character {
  constructor({
    id,
    tileX,
    tileY,
    sprites,
    offsets,
    scale,
    facing,
    behavior,
    level,
    movementType,
    alwaysAnimate,
  }) {
    super({ id, tileX, tileY, sprites, facing });

    this.offsets = offsets;
    this.scale = scale;
    this.entityType = "OP";
    this.name = id;
    this.behavior = behavior;
    this.level = level;
    this.movementType = movementType;
    this.spawnTime = 0;
    this.lifetime = Math.floor(Math.random() * 500 + 100);
    this.behaviorCooldown = 0;
    this.alwaysAnimate = alwaysAnimate;
    this.isCatched = false;
    this.isDead = false;
  }

  draw(canvas, camera) {
    const screenX = this.position.x + camera.offsetX + 2 - this.offsets.x;
    let screenY = this.position.y + camera.offsetY - this.offsets.y;

    const frameWidth = this.image.width / this.framesMax;

    if (this.movementType === "fly") screenY -= 15;

    const width = this.width * this.scale;
    const height = this.height * this.scale;

    canvas.context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      this.image.height,
      screenX,
      screenY,
      width,
      height
    );
  }

  update(game) {
    this.spawnTime++;

    this.handleLifetime(game);

    if (this.isDead || this.isCatched || this.spawnTime >= this.lifetime)
      return;

    this.handleBehavior(game);
    super.update(game);
  }

  handleLifetime(game) {
    if (this.spawnTime >= this.lifetime || this.isCatched || this.isDead)
      this.despawn(game);
  }

  despawn(game) {
    const map = game.mapManager.currentMap;
    const OP_list = map.overworldPokemons;

    this.removeOP(OP_list);
    this.resetTileOriginalIndex(map);
  }

  removeOP(list) {
    const index = list.indexOf(this);
    if (index !== -1) list.splice(index, 1);
  }

  resetTileOriginalIndex(map) {
    if (this.previousTile) {
      const { x, y, originalIndex } = this.previousTile;

      if (originalIndex === undefined || originalIndex === null) return;
      map.backgLayout[y][x] = originalIndex;
    }
  }

  handleBehavior(game) {
    switch (this.behavior) {
      case "wander":
        this.updateWander(game);
        break;
    }
  }

  updateCooldown() {
    if (this.behaviorCooldown > 0) return this.behaviorCooldown--;
    else return false;
  }

  updateWander(game) {
    if (game.isPaused || this.isMoving) return;

    if (this.updateCooldown()) return;

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    this.attemptMove(randomDir.dx, randomDir.dy, game);
    this.behaviorCooldown = 60 + Math.floor(Math.random() * 173);
  }
}
