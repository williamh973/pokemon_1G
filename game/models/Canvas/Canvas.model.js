export class Canvas {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 720;
    this.height = 480;
    canvas.width = this.width;
    canvas.height = this.height;
    this.context.imageSmoothingEnabled = true;
  }

  clear() {
    this.context.clearRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  drawImage() {
    this.context.fillStyle = "transparent";
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
