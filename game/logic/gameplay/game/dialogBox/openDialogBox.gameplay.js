export const openDialogBox = (text, dialogTree, callbackFn, game) => {
  game.dialogBox.open(text, false); // false
  game.state = "DIALOG";
  game.togglePause(true, false);
  if (dialogTree) game.openChoiceMenu(dialogTree);
  if (callbackFn) game.dialogCallback = callbackFn;
};
