import { Character } from "../Character.model.js";

export class OverworldPokemon extends Character {
  constructor({
    id,
    tileX,
    tileY,
    sprites,
    facing,
    behavior,
    level,
    movementType,
  }) {
    super({ id, tileX, tileY, sprites, facing });

    this.entityType = "OP";
    this.behavior = behavior;
    this.level = level;
    this.movementType = movementType;
    this.spawnTime = 0;
    this.lifetime = Math.floor(Math.random() * 500 + 100);
    this.behaviorCooldown = 0;
    this.alwaysAnimate = true;
  }

  update(game) {
    this.spawnTime++;

    this.handleLifetime(game);
    if (this.spawnTime >= this.lifetime) return;

    this.handleBehavior(game);
    super.update(game);
  }

  handleLifetime(game) {
    if (this.spawnTime >= this.lifetime) this.despawn(game);
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

      if (!originalIndex) return;
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
