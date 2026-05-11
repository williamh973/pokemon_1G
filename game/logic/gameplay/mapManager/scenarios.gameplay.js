import { SCENARIOS_DATABASE } from "../../../shareds/scenarios/scenarios.database.js";

export const checkScenarios = (game) => {
  const scenarios = SCENARIOS_DATABASE[game.mapManager.currentMap.id];

  Object.entries(scenarios).forEach(([scenarioId, scenario]) => {
    // addScenarioToTriggered(game, scenarioId); // pour dev sans scenario, a enlever
    const alreadyTriggered =
      game.triggeredScenarios[game.mapManager.currentMap.id].includes(
        scenarioId
      );

    if (alreadyTriggered && !scenario.repeat) return;

    if (scenario.condition && !scenario.condition(game)) return;

    if (!matchPosition(scenario.trigger, game.player)) return;

    if (!scenario.repeat) addScenarioToTriggered(game, scenarioId);

    runScenarioScript(game, scenario);
  });
};

export const matchPosition = (trigger, player) => {
  return trigger.positions.some((triggerPos) => {
    return (
      triggerPos.tileX === player.tileX && triggerPos.tileY === player.tileY
    );
  });
};

export const addScenarioToTriggered = (game, scenarioId) => {
  game.triggeredScenarios[game.mapManager.currentMap.id].push(scenarioId);
};

export const runScenarioScript = (game, scenario) => {
  game.scenarioManager.runScript(game.mapManager.currentMap.id, scenario);
};
