export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.position = {
      x: 0,
      y: 0,
    };
  }

  // follow(target) {
  //   this.position.x = this.canvas.width / 2 - target.position.x - target.width / 2;
  //   this.position.y =
  //     this.canvas.height / 2 - target.position.y - target.height / 2;
  // }
}
