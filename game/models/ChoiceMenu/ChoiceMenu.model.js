import { INPUT_STATE } from "../../logic/input/inputs.state.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { Menu } from "../Menu/Menu.model.js";

export class ChoiceMenu extends Menu {
  constructor(game, dialogTree) {
    super(game);

    this.dialogTree = dialogTree;
    this.items = this.dialogTree.start.setChoices;
    this.width = this.dialogTree.setDimension.width;
    this.height = this.dialogTree.setDimension.height;
    this.position = {
      x: 0,
      y: game.canvas.height - this.height * 2,
    };
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
    this.drawItems(context);
    this.showCursor(context);
  }

  getSelectedItem() {
    return this.items[this.currentIndex];
  }

  finalize() {
    this.dialogTree.finalize.action(this.game);
    this.game.openDialogBox(this.dialogTree.finalize.text);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;

    switch (action) {
      case INPUT_STATE.UP:
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case INPUT_STATE.DOWN:
        if (this.currentIndex < this.items.length - 1) this.currentIndex++;
        break;

      case INPUT_STATE.ACTION:
        switch (this.currentIndex) {
          case 0:
            this.dialogTree.first.action(this.game);

            if (this.dialogTree.first.text)
              this.game.openDialogBox(this.dialogTree.first.text);

            if (this.game.isSaveCompleted) this.finalize();
            break;
          case 1:
            this.dialogTree.second.action(this.game);

            if (this.dialogTree.second.text)
              this.game.openDialogBox(this.dialogTree.second.text, null);
            break;

          default:
            break;
        }
    }
  }
}
