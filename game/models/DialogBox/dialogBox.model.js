import { game } from "../../../main.js";

export class DialogBox {
  constructor(canvas, text, justPressed) {
    this.width = canvas.width;
    this.height = 65;
    this.position = {
      x: 0,
      y: canvas.height - this.height,
    };
    this.text = text;
    this.maxLines = 2;
    this.currentPageIndex = 0;
    this.isOpen = false;
    this.pages = this.createPages(text);
  }

  open() {
    this.currentPageIndex = 0;
    this.isOpen = true;
  }

  createPages(text) {
    const pages = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i += this.maxLines) {
      pages.push(lines.slice(i, i + this.maxLines));
    }
    return pages;
  }

  draw(context) {
    if (!this.isOpen) return;
    const borderColor = "black";
    context.fillStyle = "white";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);

    context.strokeStyle = borderColor;
    context.lineWidth = 2;
    context.strokeRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    this.drawText(context);
  }

  drawText(context) {
    const page = this.pages[this.currentPageIndex];
    console.log(page);
    const padding = 15;
    context.font = "16px monospace";
    context.fillStyle = "black";
    context.textBaseline = "top";

    page.forEach((line, index) => {
      context.fillText(
        line,
        this.position.x + padding,
        this.position.y + padding + index * 25
      );
    });
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      return;
    } else this.isOpen = false;
    game.closeDialog();
  }

  update(context) {
    this.draw(context);
  }
}
