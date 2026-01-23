import { drawBox } from "../../../../../../shareds/utils.js";
import { Cursor } from "../../../../../Cursor/Cursor.model.js";

export class PokedexCharacteristic {
  constructor(game, pokemonList) {
    this.game = game;
    this.pokemonList = pokemonList;
    this.position = {
      x: this.pokemonList.position.x + this.pokemonList.width,
      y: 130,
    };
    this.width = 82;
    this.height = 190;
    this.isOpen = false;
    this.hasFocus = false;
    this.items = [
      { id: "INFO", name: "INFO" },
      { id: "CRI", name: "CRI" },
      { id: "ZONE", name: "ZONE" },
      { id: "RETOUR", name: "RET" },
    ];
    this.currentIndex = 0;
    this.lineHeight = 40;
    this.cursor = new Cursor();
  }

  drawText(context) {
    const padding = 15;
    context.font = `25px PixelOperator `;
    context.fillStyle = "black";

    this.items.forEach((item, index) => {
      const positionX = this.position.x + padding + 10;
      const positionY = this.position.y + padding + index * this.lineHeight;
      context.fillText(item.name, positionX, positionY);
    });
  }

  updateCursorWhenPokemonSelected(context) {
    if (this.pokemonList.isPokemonSelected) {
      const cursorY =
        this.position.y + this.currentIndex * this.lineHeight + 20;
      this.cursor.update(context, this.position.x + 5, cursorY, false);
    }
  }

  draw(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );
    this.drawText(context);

    this.updateCursorWhenPokemonSelected(context);
  }

  openItem() {
    const itemId = this.items[this.currentIndex].id;
    if (itemId) {
      this.game.showMenuSelectedItem(itemId, this);
    }
  }

  update(context, action) {
    this.draw(context);
    if (!this.hasFocus) return;

    switch (action) {
      case "UP":
        if (this.pokemonList.isPokemonSelected && this.currentIndex > 0)
          this.currentIndex--;
        break;
      case "DOWN":
        if (
          this.pokemonList.isPokemonSelected &&
          this.currentIndex < this.items.length - 1
        )
          this.currentIndex++;
        break;
      case "ACTION":
        this.openItem();
        break;
    }
  }
}
