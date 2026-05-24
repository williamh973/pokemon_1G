import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const GIVE_NICKNAME_TO_NEW_POKEMON_DIALOG_TREE = {
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
};
