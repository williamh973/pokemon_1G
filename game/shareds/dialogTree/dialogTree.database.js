export const DIALOGS_TREE_DATABASE = {
  saveSystem: {
    start: {
      text: "Sauvegarder la partie ?",
      choices: [
        { label: "OUI", next: "yes" },
        { label: "NON", next: "no" },
      ],
    },

    yes: {
      text: "Sauvegarde en cours...",
      action: (game) => {
        game.save.capture(game);
        game.save.write();
      },
      next: "finalize",
    },

    finalize: {
      text: "Partie sauvegardé !",
    },

    no: {
      action: (game) => {
        game.closeDialogBox();
      },
    },
  },
  redHouse1F: {
    mom: {
      start: {
        text: "Tous les garçons partent un\njour de la maison. J'ai déjà\nvu ça à la TV.",
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
      },
    },
    julio: {
      start: {
        text: "Mon frère prétend que son \nRattata est le meilleur !",
      },
    },
  },
};
