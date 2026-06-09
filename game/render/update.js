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
  // console.log(game.mapManager.previousMap);

  game.tileManager.update();
  game.timeManager.update();
  game.dayNightCycle.update(game);

  const action = game.input.consume();

  NPCs(game);
  missableObjects(game);
  drawWalkingOP(game);
  drawFlyingOP(game);

  switch (game.state) {
    case "WORLD":
      if (!game.player.isMoving) game.mapManager.checkScenarios?.(game);

      if (action === "PLAYER_MENU") {
        openPlayerMenu(game);
        return;
      }
      game.player.update(game, action);
      game.weatherManager.update(game);
      game.mapNameWindow.update(game.canvas.context);
      break;
    case "DIALOG":
      game.weatherManager.update(game);
      const event = game.dialogBox?.update(game.canvas.context, action);
      handleDialogState(game, event);
      break;
    case "PLAYER_MENU":
      game.weatherManager.update(game);
      game.mainMenu?.update(game.canvas.context, action);
      break;
    case "CHOICE_MENU":
      game.weatherManager.update(game);
      game.choiceMenu?.update(game.canvas.context, action);
      break;
    case "WORLDMAP":
      game.currentScreen.update(game, action);
      break;
    case "BATTLE_MENU":
      game.currentScreen.update(game.canvas.context, action);
      game.battleMenu?.update(game.canvas.context, action);
      break;
    case "BATTLE_ATTACKS_MENU":
      game.currentScreen.update(game.canvas.context, action);
      game.battleAttacksMenu?.update(game.canvas.context, action);
      break;

    case "POKEDEX":
    case "PARTY":
    case "PARTY_SUMMARY":
    case "START_GAME":
    case "GENDER_MENU":
    case "BATTLE":
    case "INVENTORY":
      game.currentScreen.update(game.canvas.context, action);
      break;
    default:
      break;
  }

  game.transition.update();
};
