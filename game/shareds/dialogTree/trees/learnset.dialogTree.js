import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const LEARNSET_DIALOG_TREE = {
  setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
  start: {
    text: "Sauvegarder la partie ?",
    setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
  },
};
