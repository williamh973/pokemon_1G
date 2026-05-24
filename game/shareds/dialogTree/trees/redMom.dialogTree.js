export const RED_MOM_DIALOG_TREE = {
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
};
