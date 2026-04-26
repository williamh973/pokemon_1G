export class TimeManager {
  constructor() {
    this.time = 0;
    this.dayDuration = 3600;
    this.speed = 0.5; // 0.001 équivaut à  30 mn in game
  }

  update() {
    this.time = (this.time + this.speed) % this.dayDuration;
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

  isMorning() {
    return this.hours >= 6 && this.hours < 12;
  }

  isDay() {
    return this.hours >= 12 && this.hours < 18;
  }

  isSunset() {
    return this.hours >= 18 && this.hours < 20;
  }

  isNight() {
    return this.hours >= 20 || this.hours < 6;
  }
}
