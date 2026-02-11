import { POKEMON_ANIMATIONS } from "../../../../../../shareds/pokemon/animations/pokemonAnimation.database.js";
import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../../../../../AnimationSprite/AnimationSprite.model.js";
import { DialogBox } from "../../../../../DialogBox/dialogBox.model.js";

export class PokemonDetail {
  constructor(game, pokemon = "") {
    this.game = game;
    this.pokemon = pokemon;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.isOpen = false;
    this.pokemonSprite = null;
    this.dialogBox = new DialogBox(game);
  }

  open() {
    this.isOpen = true;
    this.dialogBox.hasFocus = true;
    const animKey = this.pokemon.animations.idle;
    this.pokemonSprite = new AnimatedSprite(POKEMON_ANIMATIONS.idle[animKey]);
    this.dialogBox.open(this.pokemon.desc, true);
  }

  draw(context) {
    this.drawMainBox(context);
    this.drawPokemonDatas(context);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (this.dialogBox.isOpen) {
      this.dialogBox.update(this.game.canvas.context, action);
      return;
    }
  }

  drawMainBox(context) {
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

  drawPokemonDatas(context) {
    context.fillStyle = "black";

    context.font = `25px PixelOperator `;
    this.pokemonBg(context);
    this.name(context);
    this.species(context);
    this.pkheight(context);
    this.weight(context);
    context.font = `bold 25px PixelOperator `;
    this.id(context);

    this.unitSymb(context);
    this.footPrint(context);
  }

  pokemonBg(context) {
    context.fillRect(15, 15, 120, 120);
  }

  name(context) {
    context.fillText(this.pokemon.name, 166, 10);
  }

  species(context) {
    context.fillText(this.pokemon.species, 166, 40);
  }

  pkheight(context) {
    context.fillText("TAI", 166, 70);
    context.font = `bold 25px PixelOperator `;
    context.fillText(this.pokemon.height, 236, 70);
  }

  weight(context) {
    context.font = `25px PixelOperator `;
    context.fillText("PDS", 166, 100);
    context.font = `bold 25px PixelOperator `;
    context.fillText(this.pokemon.weight, 236, 100);
  }
  unitSymb(context) {
    context.fillText("m", 276, 70);
    context.fillText("kg", 276, 100);
  }

  id(context) {
    context.fillText("No. ", 40, 166);
    context.fillText(this.pokemon.id, 70, 166);
  }

  footPrint(context) {
    this.pokemon.print
      ? context.drawImage(this.pokemon.print, 270, 150, 40, 40)
      : null;
  }
}
