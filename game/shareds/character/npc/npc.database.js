import { CHARACTER_SPRITES } from "../sprite/characterSprite.database.js";
import { DIALOGS_TREE_DATABASE } from "../../dialogTree/dialogTree.database.js";

export const NPC_DATABASE = {
  guss: {
    sprites: {
      idle: CHARACTER_SPRITES.fatKid.idle,
      walk: CHARACTER_SPRITES.fatKid.walk,
    },
    name: "Guss",
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.guss,
    behavior: "patrol",
    facing: "down",
    patrolPath: [
      ...Array(7).fill("right"),
      ...Array(3).fill("down"),
      ...Array(7).fill("left"),
      ...Array(3).fill("up"),
    ],
  },
  julio: {
    sprites: {
      idle: CHARACTER_SPRITES.fatKid.idle,
      walk: CHARACTER_SPRITES.fatKid.walk,
    },
    name: "Julio",
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.julio,
    behavior: "wander",
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
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.oak,
    behavior: "special",
    facing: "down",
    paths: {
      fromLabToplayer_A: [
        ...Array(4).fill("up"),
        ...Array(1).fill("right"),
        ...Array(1).fill("up"),
      ],
      fromLabToplayer_B: [...Array(5).fill("up")],
      escortPlayerToLab_A: [
        ...Array(11).fill("down"),
        ...Array(3).fill("right"),
        ...Array(1).fill("up"),
      ],
      escortPlayerToLab_B: [
        ...Array(11).fill("down"),
        ...Array(4).fill("right"),
        ...Array(1).fill("up"),
      ],
    },
  },
  lisa: {
    sprites: {
      idle: CHARACTER_SPRITES.middleGirl.idle,
      walk: CHARACTER_SPRITES.middleGirl.walk,
    },
    name: "Lisa",
    dialogTree: DIALOGS_TREE_DATABASE.palletTown.lisa,
    behavior: "wander",
    facing: "right",
  },
  luc: {
    sprites: {
      idle: CHARACTER_SPRITES.scientist.idle,
      walk: CHARACTER_SPRITES.scientist.walk,
    },
    name: "luc",
    dialogTree: DIALOGS_TREE_DATABASE.oakLab.luc,
    behavior: "lookAround",
    facing: "right",
  },
  noah: {
    sprites: {
      idle: CHARACTER_SPRITES.scientist.idle,
      walk: CHARACTER_SPRITES.scientist.walk,
    },
    name: "Noah",
    dialogTree: DIALOGS_TREE_DATABASE.oakLab.noah,
    behavior: "static",
    facing: "up",
  },
};
