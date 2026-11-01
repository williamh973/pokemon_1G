export class EarthquakeAnimation {
  constructor(game) {
    this.game = game;
    this.duration = 5000;
    this.elapsed = 0;
    this.isFinished = false;
    this.game.canvas.startShake(5000, 5);
  }

  update() {
    this.elapsed += 16;

    if (this.elapsed >= this.duration) this.isFinished = true;
  }
}
