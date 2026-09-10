export class Canvas {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 500; // 320 - 500 max
    this.height = 320; // 320
    canvas.width = this.width;
    canvas.height = this.height;
  }

  clear() {
    this.context.clearRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  draw() {
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  getContext() {
    return this.context;
  }
}
