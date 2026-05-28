export const selectGender = (game, genderId) => {
  if (genderId === "GIRL") game.playedWith = "lira";
  else game.playedWith = "red";
  game.state = "WORLD";
  game.togglePause(false, true);
  game.closeCurrentScreen(); // a changer
};
