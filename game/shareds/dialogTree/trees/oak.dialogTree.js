export const OAK_DIALOG_TREE = {
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
};
