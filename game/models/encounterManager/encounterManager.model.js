import { generatePokemon } from "../../logic/gameplay/encounters/generatePokemon.gameplay.js";
import { OP_CONFIG_DATABASE } from "../../shareds/character/op/op.database.js";
import {
  getSpawnAroundPlayer,
  spawnOP,
} from "../../shareds/utils/character/op/spawnOverworldPokemon.utils.js";

export class EncounterManager {
  tryDoWildEncounter(game, tile, timeManager) {
    const map = game.mapManager.currentMap;
    const tileType = map.encounter[tile.terrain];
    const encounterList = this.getEncountersForTime(tileType, timeManager);

    return this.rollEncounter(encounterList, game);
  }

  getEncountersForTime(tile, timeManager) {
    if (timeManager.isNight()) return tile.night ?? tile.day;

    return tile.day;
  }

  choosePokemonToEncounter(encounterList, game, player, map) {
    const randomN = Math.floor(Math.random() * 256);
    const slot = encounterList.find((slot) => randomN <= slot.chance);
    const chosenPokemon = slot.pokemon;
    if (!chosenPokemon) return;

    const position = getSpawnAroundPlayer(game, player);
    if (!position) return;

    const config = OP_CONFIG_DATABASE[chosenPokemon.id];
    return spawnOP(position, config, chosenPokemon, map);
  }

  rollEncounter(encounterList, game) {
    const map = game.mapManager.currentMap;
    const player = game.player;

    if (Math.random() * 256 >= map.encounterRate) return;

    this.choosePokemonToEncounter(encounterList, game, player, map);
  }

  startWildBattle(game, targetOP, tile) {
    game.transition.start(
      () => {
        game.togglePause(true, false);
      },
      (done) => {
        const wildPokemon = generatePokemon(
          targetOP,
          game.mapManager.currentMap.name
        );

        game.createBattle(wildPokemon, tile, "WILD");

        done();
      },
      () => {}
    );
  }
}
