export class Fade {
  constructor(duration) {
    this.duration = duration;
    this.color = "";
    this.phase = "in";
    this.progress = 0;
    this.active = false;
    this.onMid = null;
    this.onEnd = null;
  }

  draw(canvas) {
    if (!this.active) return;

    let alpha =
      this.phase === "out"
        ? this.progress / this.duration
        : 1 - this.progress / this.duration;

    canvas.context.fillStyle = `rgba(250,250,250,${alpha})`;
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  start(onMid, onEnd) {
    this.active = true;
    this.progress = 0;
    this.phase = "out";
    this.onMid = onMid;
    this.onEnd = onEnd;
  }

  update() {
    if (!this.active) return;

    this.progress++;

    if (this.progress >= this.duration) {
      if (this.phase === "out") {
        this.onMid();
        this.phase = "in";
        this.progress = 0;
      } else {
        this.active = false;
        this.onEnd();
      }
    }
  }
}
