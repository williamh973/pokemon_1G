import { NPC_LOCATION } from "../../../../shareds/character/npc/npcLocation.database.js";
import { serialize } from "../../../../shareds/utils/font/font.utils.js";
import { getItemById } from "../../../../shareds/utils/save/save.utils.js";
import { TILES_SIZE } from "../../../../shareds/utils/tile/tile.utils.JS";

export class Save {
  constructor() {
    this.player = {
      tileX: 0,
      tileY: 0,
      party: {
        slots: [],
      },
      gotPokedex: null,
      pokedex: {
        state: {
          seen: [],
          caught: [],
        },
      },
    };

    this.flags = null;
    this.inventory = { categories: {} };
    this.map = {
      id: undefined,
      npcLocation: [],
      npcs: [],
      triggeredScenarios: [],
    };
    this.npcLocation = null;
    this.mainMenu = {};
  }

  capture(game) {
    this.playerPosition(game);

    this.flags = game.flags;

    this.playerInventory(game);

    this.playerParty(game);

    const npcs = game.mapManager.currentMap.npcs.map((npc) => ({
      id: npc.id,
      tileX: npc.tileX,
      tileY: npc.tileY,
      sprites: npc.sprites,
      facing: npc.facing,
      name: npc.name,
      dialogTree: npc.dialogTree,
      behavior: npc.behavior,
      paths: npc.paths,
    }));

    const foundTriggeredScenarios = game.triggeredScenarios;

    this.map = {
      id: game.mapManager.currentMap.id,
      npcs: npcs,
      triggeredScenarios: foundTriggeredScenarios,
    };

    this.npcLocation = NPC_LOCATION;

    this.playerMainMenu(game);

    this.pokedex(game);
  }

  playerPosition(game) {
    this.player.tileX = game.player.tileX;
    this.player.tileY = game.player.tileY;
  }

  playerInventory(game) {
    const categories = {
      cares: serialize(game.player.inventory.cares),
      balls: serialize(game.player.inventory.balls),
      keys: serialize(game.player.inventory.keys),
      cTcS: serialize(game.player.inventory.cTcS),
    };
    this.inventory.categories = categories;
  }

  playerParty(game) {
    this.player.party.slots = game.player.party.slots.map((slot) => ({
      content: slot.content,
    }));
  }

  playerMainMenu(game) {
    this.mainMenu = {
      height: game.mainMenu.height,
      items: game.mainMenu.items,
    };
  }

  pokedex(game) {
    this.player.gotPokedex = game.player.gotPokedex;

    if (this.player.gotPokedex)
      this.player.pokedex.state = {
        seen: game.player.pokedex.pokemonList.pokedexState.seen,
        caught: game.player.pokedex.pokemonList.pokedexState.caught,
      };
  }

  write(game) {
    localStorage.setItem("POKEMON_SAVE", JSON.stringify(this));
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (raw) game.isSaveCompleted = true;

    // console.log(raw);
  }

  static loadLS() {
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Object.assign(new Save(), data);
  }

  apply(game) {
    game.player.tileX = this.player.tileX;
    game.player.tileY = this.player.tileY;
    game.player.position = {
      x: TILES_SIZE * game.player.tileX,
      y: TILES_SIZE * game.player.tileY,
    };

    game.flags = this.flags;

    game.player.inventory.cares = this.rebuild(
      game,
      this.inventory.categories.cares,
      "care"
    );
    game.player.inventory.balls = this.rebuild(
      game,
      this.inventory.categories.balls,
      "ball"
    );
    game.player.inventory.keys = this.rebuild(
      game,
      this.inventory.categories.keys,
      "key"
    );
    game.player.inventory.cTcS = this.rebuild(
      game,
      this.inventory.categories.cTcS,
      "CTCS"
    );
    game.mainMenu.items = this.mainMenu.items;

    game.player.party.slots.forEach((slot, index) => {
      slot.content = this.player.party.slots[index]?.content ?? null;
    });

    game.triggeredScenarios = this.map.triggeredScenarios;

    if (game.player.gotPokedex) {
      game.player.pokedex.pokemonList.pokedexState.seen =
        this.player.pokedex.state.seen;

      game.player.pokedex.pokemonList.pokedexState.caught =
        this.player.pokedex.state.caught;
    }
    return this;
  }

  rebuild(game, savedList, categoryKey) {
    const rebuilt = [];

    savedList.forEach((savedItem) => {
      const baseItem = getItemById(categoryKey, savedItem.id);

      rebuilt.push({
        ...baseItem,
        count: savedItem.count,
      });
    });

    rebuilt.push(game.player.inventory.CANCEL_ITEM);

    return rebuilt;
  }
}

// pour plus tard
//   name: "",
//   party: [],
//   money: 0,
// };
// this.defeatedTrainers = [];
// this.pokedex = {
//   seen: [],
//   caught: [],
// };
// this.party = {};
// this.playTime = [];
// this.time = {
//   hour: 0,
//   minute: 0,
//   totalMinutes: 0,
// };
