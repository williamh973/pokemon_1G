import { POKEDEX_DATABASE } from "../../shareds/pokedex/pokedex.database.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { getAnimationConfig } from "../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { Slot } from "../Slot/Slot.model.js";
import { SpriteViewer } from "../SpriteViewer/SpriteViewer.model.js";

export class OpeningGameSequence {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.hasFocus = false;
    this.slot = new Slot({
      positionX: 112,
      positionY: 95,
      width: 95,
      height: 100,
    });
    this.spriteViewer = null;
    this.timer = 100;
    this.getSprite(Math.floor(Math.random() * 151));
  }

  getSprite(random151) {
    // console.log(POKEDEX_DATABASE[150].id);
    if (POKEDEX_DATABASE[random151]?.id) {
      this.spriteViewer = new SpriteViewer(
        this.game,
        getAnimationConfig(POKEDEX_DATABASE[random151].id, "front"),
        this.slot
      );
      this.spriteViewer.isOpen = true;
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
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;

    if (this.timer > 0) this.timer--;
    else {
      this.getSprite(Math.floor(Math.random() * 151));
      this.timer = 500;
    }

    this.spriteViewer?.update(context);

    switch (action) {
      case "ACTION":
        this.game.openStartMenu();
        break;
    }
  }
}
