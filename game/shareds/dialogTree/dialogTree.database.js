const choices = [
  { label: "OUI", next: "first" },
  { label: "NON", next: "second" },
];

export const DIALOGS_TREE_DATABASE = {
  newGame: {
    setDimension: { width: 100, height: 32 * 2.1 },
    start: {
      text: "Etes-vous un garçon ou une\nfille ?",
      choices: choices,
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
  newPokemon: {
    setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
    start: {
      text: "Veux-tu donner un surnom à\n",
      choices: choices,
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
      choices: choices,
    },
    first: {
      text: "Excellent choix ! Il sera \nun parfait compagnion !",
      action: (game) => {
        game.flags.STARTER_CHOSEN = true;
        game.mapManager.currentMap.missableObjects =
          game.mapManager.currentMap.missableObjects.filter((item) => {
            return item.itemId !== game.player.starter.id;
          });
        game.player.team.add();
      },
    },
    second: {
      text: "Prend ton temps pour faire \nle bon choix",
      action: (game) => {
        game.closeChoiceMenu();
        game.flags.STARTER_BULBASAUR_SELECTED =
          game.flags.STARTER_CHARMANDER_SELECTED =
          game.flags.STARTER_SQUIRTLE_SELECTED =
            false;
        game.mapManager.currentMap.missableObjects.forEach((item) => {
          if (item.pokemonViewer) item.closePokemonViewer();
        });
      },
    },
  },
  saveSystem: {
    setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
    start: {
      text: "Sauvegarder la partie ?",
      choices: choices,
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
  redHouse1F: {
    mom: {
      start: {
        text: "Tous les garçons partent un\njour de la maison. J'ai déjà\nvu ça à la TV.",
        flagCheck: {
          flag: "TALKED_TO_MOM",
          trueNode: "repeat",
          falseNode: "start",
        },
        setFlag: "TALKED_TO_MOM",
        next: "repeat",
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
        text: "oh ! Mais c'est un pokémon !\nViens te battre !",
      },
    },
    julio: {
      start: {
        text: "Mon frère est moi sommes inséparable !",
      },
    },
    lisa: {
      start: {
        text: "Le laboratoire du PROF. CHEN\n m'a permis d'apprendre pleins\nde choses intérressantes \nsur les pokémons.",
      },
    },
    oak: {
      start: {
        text: "PROF.CHEN : Et toi ! Halte !",
        flagCheck: {
          flag: "OAK_BLOCK_EXIT_DONE",
          trueNode: "next",
          falseNode: "start",
        },
      },
      next: {
        text: "PROF.CHEN : C'est dangereux \nde se balader dans les hau-\ntes-herbes sans POKEMON. \nViens ! Suis-moi.",
        setFlag: "OAK_INTRO_LAB",
      },
    },
  },
  oakLab: {
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
    oak: {
      start: {
        text: "PROF.CHEN : C'est mon labo. Tu m'as fait peur tout à lheure. Il te faut un POKEMON si tu veux rester en sécurité",
        flagCheck: {
          flag: "ENTERED_OAK_LAB",
          trueNode: "next",
          falseNode: "start",
        },
      },
    },
  },
};
