import { generatePokemon } from "../../logic/gameplay/encounters/generatePokemon.gameplay.js";
import { OP_DATABASE } from "../../shareds/character/op/op.database.js";
import {
  getSpawnAroundPlayer,
  spawnOP,
} from "../../shareds/utils/character/op/spawnOverworldPokemon.utils.js";
import { BattleManager } from "../battle/BattleManager/BattleManager.model.js";

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
    console.log("randomN", randomN, "poke", chosenPokemon);
    if (!chosenPokemon) return;

    const position = getSpawnAroundPlayer(game, player);
    if (!position) return;

    const config = OP_DATABASE[chosenPokemon.id];
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
      (done, game) => {
        game.togglePause(true, false);
        const wildPokemon = generatePokemon(
          targetOP,
          game.mapManager.currentMap.name
        );

        game.battleManager = new BattleManager(
          game,
          false,
          wildPokemon,
          null,
          tile
        );
        game.activateBattleState();
        done();
      },
      () => {}
    );
  }
}
