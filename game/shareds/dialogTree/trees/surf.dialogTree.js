import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const SURF_DIALOG_TREE = {
  setDimension: { width: 32 * 2.4, height: 32 * 2.1 },
  start: {
    text: null,
    setChoices: [POSSIBLE_CHOICES_DATABASE.yes, POSSIBLE_CHOICES_DATABASE.no],
  },
  first: {
    text: null,
    action: (game) => {
      const slot = game.player.party.slots.find((slot) =>
        slot.content?.moves?.some((move) => move.id === "surf")
      );

      if (!slot) return;

      const pokemon = slot.content;

      game.dialogBox.open(`${pokemon.name} utilise Surf.`);
    },
  },
  second: {
    action: (game) => {
      game.closeDialogBox();
      game.closeChoiceMenu();
    },
  },
};
