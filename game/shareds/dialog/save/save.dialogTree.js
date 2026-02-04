export const SAVE_DIALOG = {
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
};
