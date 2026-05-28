import { POKEMON_DETAIL_SLOT_CONFIG } from "../../../../../../logic/gameplay/pokedex/pokemonDetail/slot/pokemonDetailSlot.config.js";
import { drawBox } from "../../../../../../shareds/utils/box/box.utils.js";
import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";
import { Slot } from "../../../../../Slot/Slot.model.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";
import { getAnimationConfig } from "../../../../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";

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
    this.spriteViewer = null;
    this.slot = new Slot(POKEMON_DETAIL_SLOT_CONFIG);
  }

  openSpriteViewer() {
    this.spriteViewer = new SpriteViewer(
      this.game,
      getAnimationConfig(this.pokemon.id, "front"),
      this.slot
    );
    this.spriteViewer.isOpen = true;
  }

  openDialogBox() {
    this.game.dialogBox.open(this.pokemon.desc, true);
    this.game.dialogBox.hasFocus = true;
  }

  open() {
    this.isOpen = true;
    this.openSpriteViewer();
    this.openDialogBox();
  }

  closePokemonViewer() {
    this.spriteViewer.isOpen = false;
    this.spriteViewer.sprite = null;
    this.spriteViewer = null;
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
    textParams(context, "25");
    this.unitSymb(context);
    this.name(context);
    this.category(context);
    this.number(context);
    this.footPrint(context);

    this.pkheight(context);
    this.weight(context);
  }

  name(context) {
    drawText(context, this.pokemon.name, 166, 10);
  }

  category(context) {
    drawText(context, this.pokemon.category, 166, 40);
  }

  pkheight(context) {
    drawText(context, this.pokemon.height, 236, 70);
  }

  weight(context) {
    drawText(context, this.pokemon.weight, 236, 100);
  }
  unitSymb(context) {
    drawText(context, "m", 276, 70);
    drawText(context, "kg", 276, 100);
    drawText(context, "TAI", 166, 70);
    drawText(context, "PDS", 166, 100);
  }

  number(context) {
    drawText(context, "No. ", 40, 166);
    drawText(context, this.pokemon.no, 70, 166);
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
