import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { Menu } from "../../../../../Menu/Menu.model.js";

export class PokedexCharacteristic extends Menu {
  constructor(game, pokemonList) {
    super(game);

    this.pokemonList = pokemonList;
    this.position = {
      x: this.pokemonList.position.x + this.pokemonList.width,
      y: 130,
    };
    this.width = 82;
    this.height = 190;

    this.items = [
      { id: "INFO", name: "INFO" },
      { id: "CRI", name: "CRI" },
      { id: "ZONE", name: "ZONE" },
      { id: "RETOUR", name: "RET" },
    ];
    this.lineHeight = 40;
  }

  open() {
    super.open();
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
    this.drawItems(context, 25, 20);

    if (this.pokemonList.isPokemonSelected) this.showCursor(context, 5, 25);
  }

  update(context, action) {
    super.update(action);

    if (!this.hasFocus) return;

    this.draw(context);

    switch (action) {
      case "ACTION":
        this.openItem();
        break;
    }
  }
}
