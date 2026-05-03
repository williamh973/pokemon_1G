import { OP_DATABASE } from "../../shareds/character/op/op.database.js";
import {
  getSpawnAroundPlayer,
  spawnOP,
} from "../../shareds/utils/character/op/spawnOverworldPokemon.utils.js";

export class EncounterManager {
  getEncounter(game, tile, timeManager) {
    if (!tile.encounter) return;

    const map = game.mapManager.currentMap;
    const tileType = map.encounter[tile.terrain];
    const encounters = this.getEncountersForTime(tileType, timeManager);

    return this.rollEncounter(encounters, game);
  }

  getEncountersForTime(tile, timeManager) {
    if (timeManager.isNight()) return tile.night ?? tile.day;

    return tile.day;
  }

  getRandomN() {
    return Math.random();
  }

  choosePokemonToEncounter(encounters, game, player, map) {
    const randomN = Math.floor(this.getRandomN() * encounters.length);
    const chosenPokemon = encounters[randomN];

    if (!chosenPokemon) return;

    const position = getSpawnAroundPlayer(game, player);
    if (!position) return;

    const config = OP_DATABASE[chosenPokemon.id];
    return spawnOP(position, config, chosenPokemon, map);
  }

  rollEncounter(encounters, game) {
    const map = game.mapManager.currentMap;
    const player = game.player;

    if (this.getRandomN() * 100 >= map.encounterRate) return;

    this.choosePokemonToEncounter(encounters, game, player, map);
  }
}
