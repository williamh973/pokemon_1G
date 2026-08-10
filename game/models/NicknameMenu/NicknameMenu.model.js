import { Menu } from "../Menu/Menu.model.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { drawText } from "../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { INPUT_STATE } from "../../logic/input/inputs.state.js";
import { GAME_STATES } from "../../logic/gameplay/game/states/states.gameplay.js";
import { nicknameBackgImage } from "../../assets/images/ui/ui.asset.js";

export class NicknameMenu extends Menu {
  constructor(game) {
    super(game);

    this.backgImage = nicknameBackgImage;
    this.upperSet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    this.lowerSet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(97 + i)
    );

    this.items = [];
    this.specialKeys = ["ABC", "-", ".", "⌫", "OK"];

    this.nickname = "";

    this.columns = 6;

    this.position = {
      x: 0,
      y: 0,
    };

    this.isUpperCase = false;

    this.width = game.canvas.width;
    this.height = game.canvas.height;

    this.setCharacterSet([...this.lowerSet, ...this.specialKeys]);
  }

  setCharacterSet(set) {
    this.items = set.map((letter) => ({
      id: letter,
      name: letter,
    }));
  }

  toggleCase() {
    this.isUpperCase = !this.isUpperCase;

    this.setCharacterSet(
      this.isUpperCase
        ? [...this.upperSet, ...this.specialKeys]
        : [...this.lowerSet, ...this.specialKeys]
    );
  }

  getSelectedLetter() {
    return this.items[this.currentIndex].id;
  }

  addLetter() {
    const letter = this.items[this.currentIndex].id;
    if (this.specialKeys.includes(letter)) return;
    if (this.nickname.length < 10) this.nickname += this.getSelectedLetter();
  }

  removeLetter() {
    this.nickname = this.nickname.slice(0, -1);
  }

  validate() {
    if (this.nickname.length === 0) return;

    this.game.hasPlayerNicknameSelected(this.nickname);
    this.close();
  }

  draw(context) {
    // context.drawImage(
    //   this.backgImage,
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );

    textParams(context, "20", "black");

    drawText(
      context,
      `Votre Nom : ${this.nickname}_`,
      this.position.x + 70,
      this.position.y + 25
    );

    this.drawKeyboard(context);
  }

  drawKeyboard(context) {
    this.items.forEach((letter, index) => {
      const x = this.position.x + 70 + (index % this.columns) * 35;
      const y = this.position.y + 70 + Math.floor(index / this.columns) * 25;
      drawText(context, letter.name, x, y);
    });

    const cursorX =
      this.position.x + 50 + (this.currentIndex % this.columns) * 35;

    const cursorY =
      this.position.y + 73 + Math.floor(this.currentIndex / this.columns) * 25;

    this.cursor.update(context, cursorX, cursorY);
  }

  moveLeft() {
    if (this.currentIndex % this.columns !== 0) this.currentIndex--;
  }

  moveRight() {
    if (
      this.currentIndex % this.columns !== this.columns - 1 &&
      this.currentIndex < this.items.length - 1
    )
      this.currentIndex++;
  }

  moveUp() {
    const newIndex = this.currentIndex - this.columns;

    if (newIndex >= 0) this.currentIndex = newIndex;
  }

  moveDown() {
    const currentColumn = this.currentIndex % this.columns;
    let newIndex = this.currentIndex + this.columns;

    if (newIndex >= this.items.length) newIndex = this.items.length - 1;
    else {
      const newColumn = newIndex % this.columns;

      if (newColumn !== currentColumn) newIndex = this.items.length - 1;
    }

    this.currentIndex = newIndex;
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.draw(context);

    if (!this.hasFocus) return;
    // console.log(action);

    switch (action) {
      case INPUT_STATE.LEFT:
        this.moveLeft();
        break;

      case INPUT_STATE.RIGHT:
        this.moveRight();
        break;

      case INPUT_STATE.UP:
        this.moveUp();
        break;

      case INPUT_STATE.DOWN:
        this.moveDown();
        break;

      case INPUT_STATE.ACTION:
        this.addLetter();

        switch (this.getSelectedLetter()) {
          case "⌫":
            this.removeLetter();
            break;

          case "OK":
            this.validate();
            break;

          case "ABC":
            this.toggleCase();
            break;
        }
        break;

      case INPUT_STATE.ESCAPE:
        this.removeLetter();
        break;

      case INPUT_STATE.SPACE:
        this.validate();
        break;
    }
  }
}
