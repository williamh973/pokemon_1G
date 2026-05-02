export class TimeManager {
  constructor() {
    this.time = 1500; // 2950 = 19h45
    this.dayDuration = 3600;
    this.speed = 0.1; // 0.001 équivaut à  30 mn in game
    this.active = true;
  }

  update() {
    if (this.active) this.time = (this.time + this.speed) % this.dayDuration;
  }

  draw(canvas) {
    canvas.context.fillStyle = "red";
    canvas.context.font = "16px Arial";

    canvas.context.fillText(this.timeString, 20, 20);
  }

  get normalizedTime() {
    return this.time / this.dayDuration;
  }

  get totalMinutes() {
    return this.normalizedTime * 24 * 60;
  }

  get hours() {
    return Math.floor(this.totalMinutes / 60);
  }

  get minutes() {
    return Math.floor(this.totalMinutes % 60);
  }

  get timeString() {
    const h = String(this.hours).padStart(2, "0");
    const m = String(this.minutes).padStart(2, "0");
    return `${h}:${m}`;
  }

  isDay() {
    return this.hours >= 12 && this.hours < 18;
  }

  isNight() {
    return this.hours >= 20 || this.hours < 6;
  }
}
