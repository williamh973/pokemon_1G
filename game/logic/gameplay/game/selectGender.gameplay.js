import { GAME_STATES } from "./states/states.gameplay.js";

export const selectGender = (game, genderId) => {
  if (genderId === "GIRL") game.playedWith = "lira";
  else game.playedWith = "red";

  game.state = GAME_STATES.WORLD;

  game.togglePause(false, true);
  game.closeCurrentScreen(); // a changer
};
