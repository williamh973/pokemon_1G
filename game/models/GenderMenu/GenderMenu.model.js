import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Menu } from "../Menu/Menu.model.js";

export class GenderMenu extends Menu {
  constructor(game) {
    super(game);

    this.position = {
      x: 0,
      y: 0,
    };
    this.width = canvas.width;
    this.height = canvas.height;
    this.lineHeight = 40;

    this.items = [
      { id: "BOY", name: "GARÇON" },
      { id: "GIRL", name: "FILLE" },
    ];

    this.openDialogBox();
  }

  openDialogBox() {
    const text = "Etes-vous un garçon ou une\nfille ?";
    this.game.dialogBox.open(text, true);
  }

  draw(context) {
    drawBox(context, 0, 0, this.width, this.height, "black", "white");

    this.drawItems(context);
    this.showCursor(context);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;

    if (this.game.dialogBox.isOpen)
      this.game.dialogBox.update(this.game.canvas.context, action);

    super.update(action);
  }
}
