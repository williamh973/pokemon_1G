export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  follow(player) {
    this.offsetX = this.canvas.width / 2 - player.position.x - player.width / 2;

    this.offsetY =
      this.canvas.height / 2 - player.position.y - player.height / 2;
  }
}
