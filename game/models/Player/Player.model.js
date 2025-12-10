export class Player {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 15;
    this.height = 15;
    this.name = null;
    this.hasWon = false;
    this.hasLose = false;
    this.isRunning = false;
    this.isFlying = false;
    this.isFishing = false;
    this.pokedex = null;
    this.team = null;
    this.inventory = {};
    this.trainerCard = {};
  }
}
