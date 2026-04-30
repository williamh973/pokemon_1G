import { Character } from "../Character.model.js";

export class OverworldPokemon extends Character {
  constructor({ id, tileX, tileY, sprites, facing, behavior, level }) {
    super({ id, tileX, tileY, sprites, behavior, facing });

    this.entityType = "OP";
    this.tileX = tileX;
    this.tileY = tileY;
    this.behavior = behavior;
    this.level = level;

    this.spawnTime = 0;
    this.lifetime = 500;
    this.behaviorCooldown = 0;
  }

  update(game) {
    super.update(game);

    this.spawnTime++;

    this.handleLifetime(game);
    this.handleBehavior(game);
  }

  handleLifetime(game) {
    if (this.spawnTime >= this.lifetime) this.despawn(game);
  }

  despawn(game) {
    const list = game.mapManager.currentMap.overworldPokemons;

    game.mapManager.currentMap.overworldPokemons = list.filter(
      (p) => p !== this
    );
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
