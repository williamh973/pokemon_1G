export class Fade {
  constructor(duration) {
    this.duration = duration;
    this.color = "";
    this.phase = "start";
    this.progress = 0;
    this.active = false;
    this.onStart = null;
    this.onTop = null;
    this.onEnd = null;
    this.opacity = 0;
  }

  draw(canvas) {
    if (!this.active) return;

    if (this.phase === "start") this.opacity = this.progress / this.duration;
    else if (this.phase === "end") {
      const endStart = this.duration - this.duration / 3;
      const endProgress = this.progress - endStart;
      const endDuration = this.duration / 3;
      this.opacity = 1 - endProgress / endDuration;
    }

    canvas.context.fillStyle = `rgba(250,250,250,${this.opacity})`;
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  start(onStart, onTop, onEnd) {
    this.active = true;
    this.progress = 0;
    this.phase = "start";
    this.onStart = onStart;
    this.onTop = onTop;
    this.onEnd = onEnd;
    this.onStart();
  }

  update() {
    if (!this.active) return;
    this.progress++;

    if (this.phase === "start") {
      const phaseDuration = this.duration / 2;
      this.opacity = this.progress / phaseDuration;
    }

    const topMiddle = this.duration / 2;
    if (this.phase === "start" && this.progress >= this.duration / 2) {
      this.phase = "loading";
      this.onTop(() => {
        this.phase = "end";
        this.onEnd();
      });
    }

    if (this.progress >= topMiddle && this.phase === "loading") {
      this.phase = "end";
      this.onEnd();
    }

    if (this.progress >= this.duration) {
      this.active = false;
      this.progress = 0;
    }
  }
}
