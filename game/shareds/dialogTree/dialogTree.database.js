import { removeMObyItemId } from "../utils/list/list.utils.js";
import { GENDER_DIALOG_TREE } from "./trees/gender.dialogTree.js";
import { GIVE_NICKNAME_TO_NEW_POKEMON_DIALOG_TREE } from "./trees/giveNicknameToNewPokemon.dialogTree.js";
import { OAK_DIALOG_TREE } from "./trees/oak.dialogTree.js";
import { RED_MOM_DIALOG_TREE } from "./trees/redMom.dialogTree.js";
import { SAVE_DIALOG_TREE } from "./trees/save.dialogTree.js";
import { STARTER_DIALOG_TREE } from "./trees/starter.dialogTree.js";

export const DIALOGS_TREE_DATABASE = {
  saveSystem: SAVE_DIALOG_TREE,
  selectGender: GENDER_DIALOG_TREE,
  giveNicknameToNewPokemon: GIVE_NICKNAME_TO_NEW_POKEMON_DIALOG_TREE,
  starter: STARTER_DIALOG_TREE,
  oak: OAK_DIALOG_TREE,
  redHouse1F: {
    redMom: RED_MOM_DIALOG_TREE,
  },
  palletTown: {
    guss: {
      start: {
        text: "Mon Rattata est le meilleur !",
        flagCheck: {
          flag: "GOT_STARTER",
          trueNode: "next",
          falseNode: "start",
        },
      },
      next: {
        text: "Oh ! Mais c'est un POKéMON ?\n En garde!",
      },
      defeated: {
        text: "Je me suis donc trompé\n Je continuerai à\nm'entrainer",
      },
    },
    julio: {
      repeat: {
        text: "Mon frère est moi sommes inséparable !",
      },
    },
    lisa: {
      repeat: {
        text: "Le laboratoire du PROF. CHEN\n m'a permis d'apprendre\npleins de choses intérressantes \nsur les pokémons.",
      },
    },
    oakBlockRed: {
      text: "CHEN : Et toi là ! Halte !\nNe part pas !",
      next: "oakJoinedRed",
    },

    oakJoinedRed: {
      text: "CHEN :\nDe justesse !\nC'est dangereux \nde se balader dans les hau-\ntes-herbes. Des POKEMON \nsauvages y vivent.\nViens ! Suis-moi.",
    },
  },

  oakLab: {
    story: {
      repeat: {
        text: "Ce sont les 3 derniers\nPOKéMON du professeur CHEN.",
      },
    },

    blue: {
      start: {
        text: "",
        flagCheck: {
          flag: "OAK_INTRO_LAB_DONE",
          trueNode: "next",
          falseNode: "start",
        },
      },
      next: {
        text: "Je m'en fiche si tu choisis\nen premier, j'aurais aussi\nle mien.",
        flagCheck: {
          flag: "BLUE_STARTER_CHOSEN_DONE",
          trueNode: "next2",
          falseNode: "start",
        },
      },
      next2: {
        text: "Mon POKéMON est meilleur.",
        flagCheck: {
          flag: "PLAYER_STARTER_CHOSEN_DONE",
          trueNode: "next3",
          falseNode: "start",
        },
      },

      next3: {
        text: "titi",
        flagCheck: {
          flag: "PLAYER_STARTER_CHOSEN_DONE",
          trueNode: "next",
          falseNode: "start",
        },
      },
    },

    luc: {
      start: {
        text: "Les Poké Balls sont de véri-\ntables chefs-d'œuvre techno-\nlogiques. Elles compressent\nles Pokémons en énergie pure.",
      },
    },

    noah: {
      start: {
        text: "Je travaille sur le POKEDEX.\nMais où est passé ce livre ?!",
      },
    },

    oakWarn: {
      text: "CHEN : C'est mon labo.\nJ'étudie les POKEMON\navec mes assistants.\nTu m'as fait peur tout à \nl'heure. Il te faudrait un POKE\nMON si tu veux...",
      next: "oakInterrupted",
    },

    oakInterrupted: {
      text: "BLUE : Pépé!\nJ'en ai marre d'attendre!",
      next: "oakReply",
    },

    oakReply: {
      text: "CHEN: Heu? Quoi?\nBLUE? Pourquoi es-tu déjà là?\nJe t'avais dit d'attendre.\nEnfin bref...",
      next: "oakExplain",
    },

    oakExplain: {
      text: "CHEN : Regarde RED,\nVois-tu ces balls sur la table?",
      next: "oakGiveChoice",
    },

    oakGiveChoice: {
      text: "CHEN : Tu peux en avoir un.\nVas y!\nPrends-en une!",
      next: "blueComplains",
    },

    blueComplains: {
      text: "BLUE : Ben!\nPépé! Et moi?",
      next: "oakWait",
    },

    oakWait: {
      text: "CHEN: Patience, BLUE.\nTu en auras un tout à l'heure.",
      next: "blueReaction",
    },

    blueReaction: {
      text: `BLUE: Mmh...!`,
      action: (game) => {
        game.flags.OAK_INTRO_DONE = true;
      },
    },

    playerTryToExit: {
      text: "CHEN: Attend! \nTu ne peux pas partir sans\nPOKéMON!",
    },

    blueChooseStarter: {
      text: `BLUE: Alors je prend celui là !`,
      action: (game) => {
        const currentMap = game.mapManager.currentMap;
        const starterId = game.player.starter.id;
        const rivalStarter = {
          BULBASAUR: "CHARMANDER",
          CHARMANDER: "SQUIRTLE",
          SQUIRTLE: "BULBASAUR",
        };

        currentMap.missableObjects = removeMObyItemId(
          currentMap,
          rivalStarter[starterId]
        );
      },
    },
  },
};
