import { Character } from "../Character.model.js";

export class OverworldPokemon extends Character {
  constructor({ id, tileX, tileY, sprites, facing, behavior, level }) {
    super({ id, tileX, tileY, sprites, facing });

    this.entityType = "OP";
    this.behavior = behavior;
    this.level = level;
    this.state = "walk";
    this.spawnTime = 0;
    this.lifetime = 500;
    this.behaviorCooldown = 0;
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
    const list = map.overworldPokemons;
    const index = list.indexOf(this);

    if (index !== -1) {
      list.splice(index, 1);
      this.resetTileOriginalIndex(map);
    }
  }

  resetTileOriginalIndex(map) {
    if (this.previousTile) {
      const { x, y, originalIndex } = this.previousTile;
      console.log(x, y, originalIndex);
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
