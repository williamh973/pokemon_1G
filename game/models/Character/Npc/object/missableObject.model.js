import { MO_SLOTS_CONFIG } from "../../../../logic/gameplay/character/missableObject/slot/moSlot.config.js";
import { DIALOGS_TREE_DATABASE } from "../../../../shareds/dialogTree/dialogTree.database.js";
import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
import { OBJECT_SPRITES } from "../../../../shareds/items/sprite/itemsSprite.database.js";
import { SPECIES_DATABASE } from "../../../../shareds/pokemon/species/species.database.js";
import { removeMObyFlagId } from "../../../../shareds/utils/list/list.utils.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";
import { Slot } from "../../../Slot/Slot.model.js";
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
    this.spriteViewer = null;
    this.slot = new Slot(MO_SLOTS_CONFIG);
  }

  openSpriteViewer(game, starter) {
    this.spriteViewer = new SpriteViewer(game, starter, this.slot, "front");
    this.spriteViewer.isOpen = true;
  }

  closePokemonViewer() {
    this.spriteViewer.isOpen = false;
    this.spriteViewer.pokemonSprite = null;
    this.spriteViewer = null;
  }

  isStarterPokemon(game, starter) {
    if (!game.flags["OAK_LAB"].OAK_INTRO_LAB_DONE)
      return game.openDialogBox(DIALOGS_TREE_DATABASE.oakLab.story.repeat.text);

    game.openDialogBox(
      `Veux-tu ${starter.name} ?\nc'est ${starter.desc}`,
      DIALOGS_TREE_DATABASE.starter
    );

    game.player.hasFocus(starter);

    starter = SPECIES_DATABASE[this.itemKey];

    this.openSpriteViewer(game, starter);
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
