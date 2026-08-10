import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";
import { GenderMenu } from "../GenderMenu/GenderMenu.model.js";
import { NicknameMenu } from "../NicknameMenu/NicknameMenu.model.js";
import { OpeningGameSequence } from "../OpeningGameSequence/OpeningGameSequence.model.js";
import { StartGameMenu } from "../StartGameMenu/StartGameMenu.model.js";

export class GamePhaseManager {
  constructor(game) {
    this.game = game;
    this.currentPhase = null;
  }

  setPhase(phase) {
    this.currentPhase = phase;
    this.onEnterPhase();
  }

  onEnterPhase() {
    switch (this.currentPhase) {
      case "INTRO_CINEMATIC":
        // this.openStartMenu(
        //   new StartGameMenu(this.game),
        //   GAME_STATES.START_GAME
        // );
        break;
      case "OPENING_MENU":
        this.openScreen(
          new OpeningGameSequence(this.game),
          GAME_STATES.OPENING_MENU
        );
        break;

      case "START_OR_CONTINUE":
        this.openScreen(new StartGameMenu(this.game), GAME_STATES.START_GAME);
        break;

      case "SELECT_GENDER":
        this.openScreen(new GenderMenu(this.game), GAME_STATES.GENDER_MENU);
        break;

      case "SELECT_PLAYER_NICKNAME":
        this.openScreen(new NicknameMenu(this.game), GAME_STATES.NICKNAME_MENU);
        break;
    }
  }

  openScreen(screen, state) {
    this.game.screenManager.open(screen, state);
  }
}
