import { CHARACTER_SPRITES } from "../sprite/sprite.database.js";
import { DIALOGS_TREE_DATABASE } from "../../dialogTree/dialogTree.database.js";

export const NPC_DATABASE = {
  guss: {
    sprites: {
      idle: CHARACTER_SPRITES.fatKid.idle,
      walk: CHARACTER_SPRITES.fatKid.walk,
    },
    name: "Guss",
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.guss,
    behavior: "wander",
    facing: "down",
  },
  julio: {
    sprites: {
      idle: CHARACTER_SPRITES.fatKid.idle,
      walk: CHARACTER_SPRITES.fatKid.walk,
    },
    name: "Julio",
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.julio,
    behavior: "lookAround",
    facing: "up",
  },
  mom: {
    sprites: {
      idle: CHARACTER_SPRITES.mom.idle,
      walk: CHARACTER_SPRITES.mom.walk,
    },
    name: "Mom",
    dialogTree: DIALOGS_TREE_DATABASE.redHouse1F.mom,
    behavior: "static",
    facing: "left",
  },
  oak: {
    sprites: {
      idle: CHARACTER_SPRITES.oak.idle,
      walk: CHARACTER_SPRITES.oak.walk,
    },
    name: "Oak",
    dialogTree: "oakLab.oak",
    behavior: "patrol",
    facing: "down",
  },
};
