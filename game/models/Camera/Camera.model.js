export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // follow(target) {
  //   this.offsetX = this.canvas.width / 2 - target.position.x - target.width / 2;
  //   this.offsetY =
  //     this.canvas.height / 2 - target.position.y - target.height / 2;
  // }
}
