export const dialog = (tree) => {
  return (game, done) => {
    game.openDialogBox(tree.text, null, done);
  };
};
