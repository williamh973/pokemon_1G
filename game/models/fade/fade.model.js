export class Fade {
  constructor(duration) {
    this.duration = duration;
    this.phase = "start";
    this.progress = 0;
    this.opacity = 0;
    this.active = false;

    this.onStart = null;
    this.onTop = null;
    this.onEnd = null;
  }

  draw(canvas) {
    if (!this.active) return;

    canvas.context.fillStyle = `rgba(0,0,0,${this.opacity})`;
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

  update(canvas) {
    if (!this.active) return;

    this.progress++;

    const halfDuration = this.duration / 2;

    switch (this.phase) {
      case "start":
        this.opacity = this.progress / halfDuration;

        if (this.progress >= halfDuration) {
          this.opacity = 1;
          this.phase = "loading";

          this.onTop(() => {
            this.phase = "end";
            this.onEnd();
          });
        }
        break;

      case "loading":
        this.opacity = 1;
        break;

      case "end":
        this.opacity = 1 - (this.progress - halfDuration) / halfDuration;

        if (this.progress >= this.duration) {
          this.opacity = 0;
          this.active = false;
          this.progress = 0;
          this.phase = "start";
        }
        break;
    }

    this.draw(canvas);
  }
}
