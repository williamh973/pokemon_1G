import { DIALOGS_TREE_DATABASE } from "../../../../shareds/dialogTree/dialogTree.database.js";
import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { SPECIES_DATABASE } from "../../../../shareds/pokemon/species/species.database.js";
import { removeMObyFlagId } from "../../../../shareds/utils/list/list.utils.js";
import { PokemonViewer } from "../../../PokemonViewer/PokemonViewer.model.js";
import { Slot } from "../../../battle/BattleManager/slot/Slot.model.js";
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

    this.entityType = "MO";
    this.itemId = id;
    this.flagId = flagId;
    this.itemKey = key;
    this.category = category;
    this.name = name;
    this.pokemonViewer = null;
    this.slot = new Slot(112, 95, 95, 100);
  }

  openPokemonViewer(game, starter) {
    this.pokemonViewer = new PokemonViewer(game, starter, this.slot, "front");
    this.pokemonViewer.isOpen = true;
  }

  closePokemonViewer() {
    this.pokemonViewer.isOpen = false;
    this.pokemonViewer.pokemonSprite = null;
    this.pokemonViewer = null;
  }

  isStarterPokemon(game, starter) {
    if (!game.flags["OAK_LAB"].OAK_INTRO_LAB_DONE)
      return game.openDialogBox(DIALOGS_TREE_DATABASE.oakLab.story.repeat.text);

    game.player.starter = starter;

    game.openDialogBox(
      `Veux-tu ${starter.name} ?\nc'est ${starter.desc}`,
      DIALOGS_TREE_DATABASE.starter
    );

    // A tester
    const foundedStarter = SPECIES_DATABASE[starter.id];
    this.openPokemonViewer(game, foundedStarter);
  }

  getItemInDatabase() {
    const category = ITEMS_DATABASE[this.category];
    const item = category[this.itemKey];
    return item;
  }

  interact(game) {
    const item = this.getItemInDatabase();
    const mapId = game.mapManager.currentMap.id;

    if (item.isPokemon) {
      return this.isStarterPokemon(game, item);
    } else {
      game.flags[mapId][this.flagId] = true;

      game.mapManager.currentMap.missableObjects = removeMObyFlagId(
        game,
        this.flagId
      );

      game.player.inventory.add(item, this.category);

      game.openDialogBox(
        `${game.player.nickname} obtient ${item.name} !`,
        null
      );
    }
  }
}
