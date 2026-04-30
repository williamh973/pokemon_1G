import { OP_DATABASE } from "../../shareds/character/op/op.database.js";
import {
  getSpawnAroundPlayer,
  spawnOP,
} from "../../shareds/utils/character/op/spawnOverworldPokemon.utils.js";

export class EncounterManager {
  getEncounter(game, tile, timeManager) {
    if (!tile.encounter) return;

    const map = game.mapManager.currentMap;
    const zone = map.encounter[tile.terrain];
    const encounters = this.getEncountersForTime(zone, timeManager);

    return this.rollEncounter(encounters, game);
  }

  getEncountersForTime(encounters, timeManager) {
    if (timeManager.isNight()) return encounters.night ?? encounters.day;

    return encounters.day;
  }

  getRandomN() {
    return Math.random() * 100;
  }

  getRandomLevel(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rollEncounter(encounters, game) {
    const map = game.mapManager.currentMap;
    const player = game.player;

    let randomN = this.getRandomN();
    console.log(randomN);
    if (randomN >= map.encounterRate) return;

    let sum = 0;

    for (const encounter of encounters) {
      sum += encounter.rate;

      if (this.getRandomN() <= sum) {
        const position = getSpawnAroundPlayer(game, player);
        if (!position) return;

        const chosenPokemon = {
          ...encounter,
          level: this.getRandomLevel(encounter.minLevel, encounter.maxLevel),
          tileX: position.x,
          tileY: position.y,
        };

        if (chosenPokemon) {
          const config = OP_DATABASE[chosenPokemon.id];
          return spawnOP(config, chosenPokemon, map);
        }
      }
    }

    return null;
  }
}
