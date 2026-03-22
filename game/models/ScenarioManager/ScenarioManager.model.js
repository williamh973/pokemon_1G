import { SCENARIO_SCRIPTS } from "../../logic/gameplay/scenarios/scenario.scripts.js";

export class ScenarioManager {
  constructor(game) {
    this.game = game;
    this.actions = [];
    this.running = false;
  }

  start(actions) {
    this.actions = [...actions];
    this.running = true;
    this.next();
  }

  next() {
    if (this.actions.length === 0) {
      this.running = false;
      return;
    }

    const action = this.actions.shift();
    action(this.game, () => this.next());
  }

  runScript(currentMapId, scenario) {
    const foundedScript = SCENARIO_SCRIPTS[currentMapId][scenario.script];

    if (!foundedScript) {
      console.warn(`Script ${script} not found`);
      return;
    }

    foundedScript(this.game);
  }
}
