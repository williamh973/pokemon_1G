import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { PokemonViewer } from "../../../../../PokemonViewer/PokemonViewer.model.js";
import { Slot } from "../../../../../battle/BattleManager/slot/Slot.model.js";

export class PokemonDetail {
  constructor(pokemonList, game, pokemon = "") {
    this.pokemonList = pokemonList;
    this.game = game;
    this.pokemon = pokemon;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.isOpen = false;
    this.pokemonViewer = null;
    this.slot = new Slot(15, 15, 120, 120);
  }

  openPokemonViewer() {
    this.pokemonViewer = new PokemonViewer(
      this.game,
      this.pokemon,
      this.slot,
      "front"
    );
    this.pokemonViewer.isOpen = true;
  }

  openDialogBox() {
    this.game.dialogBox.open(this.pokemon.desc, true);
    this.game.dialogBox.hasFocus = true;
  }

  open() {
    this.isOpen = true;
    this.openPokemonViewer();
    this.openDialogBox();
  }

  closePokemonViewer() {
    this.pokemonViewer.isOpen = false;
    this.pokemonViewer.pokemonSprite = null;
    this.pokemonViewer = null;
  }

  openPokemonList() {
    this.pokemonList.open();
  }

  close() {
    this.closePokemonViewer();
    this.openPokemonList();
    this.game.dialogBox.close();
    this.isOpen = false;
  }

  draw(context) {
    this.drawMainBox(context);
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

  drawPokemonDatas(context) {
    context.fillStyle = "black";

    context.font = `25px PixelOperator `;
    this.name(context);
    this.category(context);
    this.pkheight(context);
    this.weight(context);
    context.font = `bold 25px PixelOperator `;
    this.number(context);
    this.unitSymb(context);
    this.footPrint(context);
  }

  name(context) {
    context.fillText(this.pokemon.name, 166, 10);
  }

  category(context) {
    context.fillText(this.pokemon.category, 166, 40);
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

  number(context) {
    context.fillText("No. ", 40, 166);
    context.fillText(this.pokemon.no, 70, 166);
  }

  footPrint(context) {
    this.pokemon.print
      ? context.drawImage(this.pokemon.print, 270, 150, 40, 40)
      : null;
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    if (this.game.dialogBox.isOpen) {
      const result = this.game.dialogBox.update(
        this.game.canvas.context,
        action
      );
      if (result === this.game.dialogBox.noMorePage()) this.close();
    }
  }
}
