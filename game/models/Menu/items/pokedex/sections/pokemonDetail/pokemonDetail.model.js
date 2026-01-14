import { drawBox } from "../../../../../../shareds/utils.js";

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
  }

  draw(context) {
    if (!this.isOpen) return;
    this.drawMainBox(context);
    this.drawPokemonImage(context);
    this.drawPokemonDatas(context);
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

  drawPokemonImage(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "black",
      "white"
    );
    context.drawImage(
      this.pokemon.img,
      this.position.x,
      this.position.y,
      150,
      150
    );
  }

  drawPokemonDatas(context) {
    context.fillStyle = "black";

    context.font = `25px PixelOperator `;
    this.name(context);
    this.species(context);
    this.pkheight(context);
    this.weight(context);
    context.font = `bold 25px PixelOperator `;
    this.id(context);

    this.unitSymb(context);
    this.footPrint(context);
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
    context.drawImage(this.pokemon.print, 270, 150, 40, 40);
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
  }
}
