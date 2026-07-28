import { trainerCardBackgImage } from "../../../../assets/images/ui/ui.asset.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { drawText } from "../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../shareds/utils/font/font.utils.js";

export class TrainerCard {
  constructor(game) {
    this.game = game;
    this.backgImg = trainerCardBackgImage;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.isOpen = false;
    this.hasFocus = false;
  }

  drawBackgImage(context) {
    context.drawImage(
      this.backgImg,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
  }

  close() {
    this.isOpen = false;
    this.hasFocus = false;
  }

  drawTrainerId(context, player) {
    drawText(context, player.trainerId, 225, 17);
  }

  drawMoney(context, player) {
    context.textAlign = "right";
    drawText(context, player.money, 170, 63);
  }

  drawPokemonCaught(context, player) {
    drawText(
      context,
      player.pokedex.pokemonList.pokedexState.caught.length,
      170,
      80
    );
    context.textAlign = "left";
  }

  draw(context) {
    this.drawBackgImage(context);

    textParams(context, "14");

    const player = this.game.player;

    this.drawTrainerId(context, player);
    this.drawMoney(context, player);
    this.drawPokemonCaught(context, player);
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.draw(context);

    if (!this.hasFocus) return;

    switch (action) {
      case INPUT_STATE.ESCAPE:
        this.game.closeAndReturnFromSubMenu();
        break;
      default:
        break;
    }
  }
}
