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
}
