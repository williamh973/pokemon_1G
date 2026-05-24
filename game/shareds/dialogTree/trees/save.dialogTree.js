import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const SAVE_DIALOG_TREE = {
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
};
