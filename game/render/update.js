const openMenu = (game) => {
  game.player.draw(game.canvas, game.camera);
  game.openMenu();
};

const NPCs = (game) => {
  game.mapManager.currentMap.npcs?.forEach((npc) => {
    npc.update(game);
  });
};

const missableObjects = (game) => {
  game.mapManager.currentMap.missableObjects?.forEach((object) => {
    object.update(game, null);
    if (object.pokemonViewer)
      object.pokemonViewer.update(game.canvas.context, null);
  });
};

const handleDialogState = (game, event) => {
  if (event === "END_DIALOG") game.closeDialogBox();
};

const weather = (game) => {
  if (
    game.mapManager.currentMap.weathers?.includes("rain") &&
    game.rainSystem.active &&
    game.flags.weather.rain
  ) {
    game.splashSystem.update(game.canvas.context);
    game.rainSystem.update(game.canvas.context);
  }
};

export const update = (game) => {
  // console.log(game.state);
  // console.log("tileX", game.player.tileX, "tileY", game.player.tileY);
  // console.log(game.mapManager.previousMap);

  console.log();
  game.tileManager.update();
  game.timeManager.update();
  game.dayNightCycle.update(game.canvas, game.timeManager);

  const action = game.input.consume();

  NPCs(game);
  missableObjects(game);

  switch (game.state) {
    case "WORLD":
      if (!game.player.isMoving) game.mapManager.checkScenarios?.(game);

      if (action === "MENU") {
        openMenu(game);
        return;
      }
      game.player.update(game, action);
      game.mapNameWindow.update(game.canvas.context);
      break;
    case "DIALOG":
      const event = game.dialogBox?.update(game.canvas.context, action);
      handleDialogState(game, event);
      break;
    case "MENU":
      game.mainMenu?.update(game.canvas.context, action);
      break;
    case "CHOICE_MENU":
      game.choiceMenu?.update(game.canvas.context, action);
      break;
    case "POKEDEX":
      game.currentScreen.update(game.canvas.context, action);
      break;
    case "WORLDMAP":
      game.currentScreen.update(game, action);
      break;
    case "TITLE":
      game.currentScreen.update(game.canvas.context, action);
      break;
    case "FIGHT":
      game.currentScreen.update(game.canvas.context, action);
      break;
    case "INVENTORY":
      game.currentScreen.update(game.canvas.context, action);
      break;
  }

  weather(game);

  game.transition.update();
};
