import { generatePokemon } from "../../logic/gameplay/encounters/generatePokemon.gameplay.js";
import { removeMObyItemId } from "../utils/list/list.utils.js";

export const POSSIBLE_CHOICES_DATABASE = {
  yes: { label: "OUI", next: "first" },
  no: { label: "NON", next: "second" },
  girl: { label: "FILLE", next: "second" },
  boy: { label: "GARÇON", next: "first" },
};

export const DIALOGS_TREE_DATABASE = {
  saveSystem: {
    setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
    start: {
      text: "Sauvegarder la partie ?",
      setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
    },
    first: {
      text: "Sauvegarde en cours...",
      action: (game) => {
        game.save.capture(game);
        game.save.write(game);
      },
      next: "finalize",
    },
    finalize: {
      text: "Partie sauvegardé !",
      action: (game) => {
        game.closeChoiceMenu();
        game.resetSaveCompleted();
      },
    },
    second: {
      action: (game) => {
        game.closeDialogBox();
        game.closeChoiceMenu();
        game.resetSaveCompleted();
      },
    },
  },
  selectGender: {
    setDimension: { width: 100, height: 32 * 2.1 },
    start: {
      text: "Etes-vous un garçon ou une\nfille ?",
      setChoices: [
        POSSIBLE_CHOICES_DATABASE.boy,
        POSSIBLE_CHOICES_DATABASE.girl,
      ],
    },
    first: {
      text: "Un garçon, d'accord !",
      action: (game) => {
        game.playedWith = "red";
      },
    },
    second: {
      text: "Une fille, d'accord !",
      action: (game) => {
        game.playedWith = "lira";
      },
    },
  },

  giveNicknameToNewPokemon: {
    setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
    start: {
      text: "Veux-tu donner un surnom à\n",
      setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
    },
    first: {
      action: (game) => {
        game.openNicknameMenu();
      },
    },
    second: {
      action: (game) => {
        game.closeDialogBox();
        game.closeChoiceMenu();
      },
    },
  },

  starter: {
    setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
    start: {
      setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
    },
    first: {
      text: "CHEN : Excellent choix !\nIl sera un parfait\ncompagnion !",
      action: (game) => {
        const currentMap = game.mapManager.currentMap;
        const player = game.player;
        let focusedStarter = player.focusedStarter;

        game.mapManager.currentMap.missableObjects = removeMObyItemId(
          currentMap,
          focusedStarter.id
        );

        focusedStarter = {
          ...focusedStarter,
          level: 5,
        };

        const starter = generatePokemon(focusedStarter);

        player.team.add(starter);
        game.flags.OAK_LAB.PLAYER_STARTER_CHOSEN_DONE = true;
      },
    },
    second: {
      text: "CHEN : Prend ton temps pour\nfaire le bon choix.",
      action: (game) => {
        game.closeChoiceMenu();
        game.mapManager.currentMap.missableObjects.forEach((item) => {
          if (item.pokemonViewer) item.closePokemonViewer();
        });
      },
    },
  },

  oak: {
    start: {
      text: `CHEN : RED,\nquel POKéMON choisis-tu?`,
      flagCheck: {
        flag: "OAK_INTRO_LAB_DONE",
        trueNode: "start",
        falseNode: "next",
      },
    },
    next: {
      text: "CHEN : Ton POKéMON\nte protègera des\nPOKéMON sauvages!",
      flagCheck: {
        flag: "OAK_INTRO_LAB_DONE",
        trueNode: "repeat",
        falseNode: "start",
      },
    },
    repeat: {
      text: `Le monde est à toi RED.`,
    },
  },

  redHouse1F: {
    redMom: {
      start: {
        text: "Tous les garçons partent un\njour de la maison. J'ai déjà\nvu ça à la TV.",
        setFlag: "TALKED_TO_MOM",
        flagCheck: {
          flag: "TALKED_TO_MOM",
          trueNode: "repeat",
          falseNode: "start",
        },
        action: (game) => {
          game.flags[game.mapManager.currentMap.id].TALKED_TO_MOM = true;
        },
      },
      repeat: {
        text: "N'oublie pas de dire bonjour\nau professeur Chen.",
      },
    },
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
