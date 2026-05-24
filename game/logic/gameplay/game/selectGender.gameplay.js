export const selectGender = (game, genderId) => {
  if (genderId === "GIRL") game.playedWith = "lira";
  else game.playedWith = "red";

  game.closeStartMenu(); // a changer
};
