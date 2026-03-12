import { DIALOGS_TREE_DATABASE } from "../../../../shareds/dialogTree/dialogTree.database.js";
import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { removeMObyFlagId } from "../../../../shareds/utils/list/list.utils.js";
import { PokemonViewer } from "../../../PokemonViewer/PokemonViewer.model.js";
import { Npc } from "../npc.model.js";

export class MissableObject extends Npc {
  constructor({ key, tileX, tileY, id, category, flagId, name }) {
    super({
      tileX,
      tileY,
      sprites: {
        idle: OBJECT_SPRITES.pokeball.idle,
      },
      facing: "down",
    });
    this.itemId = id;
    this.flagId = flagId;
    this.itemKey = key;
    this.category = category;
    this.name = name;
    this.pokemonViewer = null;
  }

  openPokemonViewer(game, starter) {
    this.pokemonViewer = new PokemonViewer(game, starter);
    this.pokemonViewer.isOpen = true;
  }

  closePokemonViewer() {
    this.pokemonViewer.isOpen = false;
    this.pokemonViewer.pokemonSprite = null;
    this.pokemonViewer = null;
  }

  isStarterPokemon(game, starter) {
    // game.flags[this.flagId] = true;
    game.player.starter = starter;

    this.openPokemonViewer(game, starter);

    if (game.flags.scenarios.oakLab.STARTER_CHOSEN_DONE) return;
    return game.openDialogBox(
      `Veux-tu ${starter.name} ?\nc'est ${starter.desc}`,
      DIALOGS_TREE_DATABASE.starter
    );
  }

  getItemInDatabase() {
    const category = ITEMS_DATABASE[this.category];
    const item = category[this.itemKey];
    return item;
  }

  interact(game) {
    const item = this.getItemInDatabase();
    const mapId = game.mapManager.currentMap.id;

    if (item.isPokemon && !game.flags["OAK_LAB"].STARTER_CHOSEN_DONE)
      return this.isStarterPokemon(game, item);

    if (game.flags["OAK_LAB"].STARTER_CHOSEN_DONE) return;

    game.flags[mapId][this.flagId] = true;
    game.openDialogBox(`${game.player.nickname} obtient ${item.name} !`, null);

    game.mapManager.currentMap.missableObjects = removeMObyFlagId(
      game,
      this.flagId
    );

    game.player.inventory.add(item, this.category);
  }
}
