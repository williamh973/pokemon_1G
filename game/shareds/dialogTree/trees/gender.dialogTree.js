import { POSSIBLE_CHOICES_DATABASE } from "../choices.database.js";

export const GENDER_DIALOG_TREE = {
  setDimension: { width: 100, height: 32 * 2.1 },
  start: {
    text: "Etes-vous un garçon ou une\nfille ?",
    setChoices: [POSSIBLE_CHOICES_DATABASE.boy, POSSIBLE_CHOICES_DATABASE.girl],
  },
  first: {
    text: "Un garçon, d'accord !",
  },
  second: {
    text: "Une fille, d'accord !",
  },
};
