import { POKEDEX_DATABASE } from "../../../../../logic/gameplay/pokemon/pokemon.database.js";
import { drawBox } from "../../../../../shareds/utils.js";
import { Cursor } from "../../../../Cursor/Cursor.model.js";

export class pokemonList {
  constructor(canvas, isOpen) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width / 1.5;
    this.height = canvas.height;
    this.isOpen = isOpen;
    this.databases = POKEDEX_DATABASE;
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.heightLine = 40;
    this.cursor = new Cursor();
    this.title = "SOMMAIRE";
  }

  drawText(context) {
    context.font = `27px PixelOperator `;
    context.fillStyle = "black";
    context.textBaseline = "top";

    this.databases.forEach((pokemon, index) => {
      const paddingX = 30;
      const paddingY = 50;
      const positionX = this.position.x + paddingX;
      const positionY = this.position.y + paddingY + index * this.heightLine;
      if (pokemon.seen)
        this.hasSeen(context, positionX, positionY, pokemon, index);
      else this.hasNotSeen(context, positionX, positionY, pokemon, index);
    });

    context.fillStyle = "white";
    context.fillRect(1, 1, this.width - 10, 40);
    context.fillStyle = "black";
    context.font = `27px PixelOperator `;
    context.fillText(this.title, 50, 0, this.width, 50);
  }

  hasSeen(context, positionX, positionY, pokemon, index) {
    context.font = `23px PixelOperator`;
    context.fillText(
      pokemon.id,
      positionX,
      positionY,
      this.width,
      this.heightLine * index
    );

    context.fillText(
      pokemon.name,
      positionX + 50,
      positionY,
      this.width,
      this.heightLine * index
    );
  }

  hasNotSeen(context, positionX, positionY, pokemon, index) {
    context.fillText(
      pokemon.id,
      positionX,
      positionY,
      this.width,
      this.heightLine * index
    );
    context.fillText(
      "- - - - - - -",
      positionX + 50,
      positionY,
      this.width,
      this.heightLine * index
    );
  }

  handleScroll() {
    const visibleCount = 7;

    if (this.currentIndex >= visibleCount) {
      this.position.y =
        -(this.currentIndex - (visibleCount - 1)) * this.lineHeight;
    } else {
      this.position.y = 0;
    }
  }

  draw(context) {
    if (!this.isOpen) return;

    drawBox(context, 0, 0, this.width, this.height);
    this.drawText(context);

    const cursorY =
      this.position.y +
      this.heightLine +
      this.currentIndex * this.lineHeight +
      15;

    this.cursor.draw(context, this.position.x + 5, cursorY);
  }

  update(context) {
    this.draw(context);
    this.handleScroll();
  }
}
