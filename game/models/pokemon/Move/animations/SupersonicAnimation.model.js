export class SupersonicAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    this.targetViewer =
      this.viewers.front.slot.content === this.target
        ? this.viewers.front
        : this.viewers.back;

    this.waves = [];

    this.waveIndex = 0;
    this.waveDelay = 8;
    this.waveTimer = 0;

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    this.waveTimer++;

    if (this.waveTimer >= this.waveDelay && this.waveIndex < 4) {
      this.waveTimer = 0;

      this.createWave();
      this.waveIndex++;
    }

    for (const wave of this.waves) {
      this.updateWave(wave);
      this.drawWave(context, wave);
    }

    this.waves = this.waves.filter((wave) => wave.opacity > 0);

    if (this.waveIndex >= 4 && this.waves.length === 0) {
      this.isFinished = true;
    }
  }

  createWave() {
    const center = this.getCenter(this.targetViewer);

    this.waves.push({
      x: center.x,
      y: center.y,
      radius: 2,
      opacity: 1,
    });
  }

  updateWave(wave) {
    wave.radius += 2;
    wave.opacity -= 0.05;
  }

  drawWave(context, wave) {
    context.save();

    context.globalAlpha = Math.max(0, wave.opacity);
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 2;

    context.beginPath();

    context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);

    context.stroke();

    context.restore();
  }

  getCenter(viewer) {
    return {
      x: viewer.sprite.position.x + viewer.sprite.frameWidth / 2,

      y: viewer.sprite.position.y + viewer.sprite.frameHeight / 2,
    };
  }
}
