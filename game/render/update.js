import { GAME_STATES } from "../logic/gameplay/game/states/states.gameplay.js";

const openPlayerMenu = (game) => {
  game.player.draw(game.canvas, game.camera);
  game.openPlayerMenu();
};

const NPCs = (game) => {
  game.mapManager.currentMap.npcs?.forEach((npc) => {
    npc.update(game);
  });
};

const drawWalkingOP = (game) => {
  const allOP = game.mapManager.currentMap.overworldPokemons ?? [];

  allOP
    .filter((op) => op.movementType !== "fly")
    .forEach((op) => op.update(game));
};

const drawFlyingOP = (game) => {
  const allOP = game.mapManager.currentMap.overworldPokemons ?? [];

  allOP
    .filter((op) => op.movementType === "fly")
    .forEach((op) => op.update(game));
};

const missableObjects = (game) => {
  game.mapManager.currentMap.missableObjects?.forEach((object) => {
    object.update(game, null);
    if (object.spriteViewer)
      object.spriteViewer.update(game.canvas.context, null);
  });
};

const handleDialogState = (game, event) => {
  if (event === "END_DIALOG") game.closeDialogBox();
};

export const update = (game) => {
  // console.log(game.state);
  // console.log("tileX", game.player.tileX, "tileY", game.player.tileY);
  // console.log(game.screenManager.currentScreen);

  game.tileManager.update();
  game.dayNightCycle.update(game);
  game.timeManager.update(game.canvas.context);

  const action = game.input.consume();

  NPCs(game);
  missableObjects(game);
  drawWalkingOP(game);
  drawFlyingOP(game);

  switch (game.state) {
    case GAME_STATES.WORLD:
      if (!game.player.isMoving) game.mapManager.checkScenarios?.(game);

      if (action === GAME_STATES.PLAYER_MENU) {
        openPlayerMenu(game);
        return;
      }
      game.weatherManager.update(game);
      game.mapNameWindow.update(game.canvas.context);
      game.player.update(game, action);
      break;
    case GAME_STATES.DIALOG:
      game.weatherManager.update(game);
      const event = game.dialogBox?.update(game.canvas.context, action);
      handleDialogState(game, event);
      break;
    case GAME_STATES.PLAYER_MENU:
      game.weatherManager.update(game);
      game.mainMenu?.update(game.canvas.context, action);
      break;
    case GAME_STATES.CHOICE_MENU:
      game.weatherManager.update(game);

      if (game.isAttemptSave)
        game.mainMenu?.update(game.canvas.context, action);

      game.choiceMenu?.update(game.canvas.context, action);
      game.dialogBox?.update(game.canvas.context, action);
      break;
    case GAME_STATES.WORLDMAP:
      game.screenManager.currentScreen.update(game.canvas.context, action);
      break;
    case GAME_STATES.BATTLE:
      game.screenManager.currentScreen.update(game.canvas.context, action);
      game.weatherManager.update(game);
      game.dialogBox?.update(game.canvas.context, action);
      break;
    case GAME_STATES.BATTLE_MENU:
      game.screenManager.currentScreen.update(game.canvas.context, action);
      game.weatherManager.update(game);
      game.dialogBox?.update(game.canvas.context, action);
      game.battleManager.battleMenu?.update(game.canvas.context, action);
      break;
    case GAME_STATES.BATTLE_MOVES_MENU:
      game.screenManager.currentScreen.update(game.canvas.context, action);
      game.weatherManager.update(game);
      game.dialogBox?.update(game.canvas.context, action);
      game.battleManager.battleMovesMenu?.update(game.canvas.context, action);
      break;

    default:
      game.screenManager.currentScreen?.update(game.canvas.context, action);
      game.dialogBox?.update(game.canvas.context, action);
      break;
  }

  game.transition.update(game.canvas);
};
