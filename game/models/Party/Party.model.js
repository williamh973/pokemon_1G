import { partyBackgImg } from "../../assets/images/ui/ui.asset.js";
import { PARTY_SLOT_CONFIG } from "../../logic/gameplay/character/player/party/partySlots.config.js";
import { ICON_CONFIG_DATABASE } from "../../shareds/pokemon/configs/icons/iconConfig.database.js";
import { createImg } from "../../shareds/utils/assets/assets.utils.js";
import { textParams } from "../../shareds/utils/font/font.utils.js";
import { Slot } from "../battle/BattleManager/slot/Slot.model.js";

export class Party {
  constructor(game) {
    this.game = game;
    this.name = "PARTY";
    this.canvas = this.game.canvas;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.canvas.width;
    this.isOpen = false;
    this.backgImg = partyBackgImg;
    this.pokemons = [];
    this.slots = []; // 6
    this.height = this.canvas.height;
    this.hasFocus = false;
    this.maxCount = 6;
    this.minCount = 1;
    this.currentIndex = 0;
    this.baseY = 21;
    this.initSlots();
  }

  initSlots() {
    this.slots.push(new Slot(PARTY_SLOT_CONFIG.first, null)); // 2 slots pour l'instant, c'est volontaire
  }

  addPokemonToFirstEmptySlot(pokemon) {
    let emptySlot = this.slots.find((slot) => slot.content === null);
    emptySlot.content = pokemon;
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
  }

  openMainMenu() {
    this.game.openMenu();
  }

  close() {
    this.resetCurrentScreen();
    this.openMainMenu();
    this.hasFocus = false;
    this.isOpen = false;
  }

  resetCurrentScreen() {
    this.game.resetCurrentScreen();
  }

  // drawPokemons(context) {
  //   textParams(context, "17", "whitesmoke");

  //   this.slots.forEach((slot) => {
  //     this.drawPokemon(context, slot);
  //   });
  // }

  // drawPokemon(context, slot) {
  //   if (!slot.content) return;
  //   this.drawIcon(context, slot);
  //   this.drawName(context, slot);
  //   this.drawGender(context, slot);
  //   this.drawLevel(context, slot);
  // }

  // drawIcon(context, slot) {
  //   const pokemon = slot.content;

  //   const configIcon = ICON_CONFIG_DATABASE[pokemon.id];
  //   const image = configIcon.image;
  //   context.drawImage(
  //     image,
  //     slot.position.x - 20,
  //     slot.position.y - 20,
  //     configIcon.width * configIcon.scale,
  //     configIcon.height * configIcon.scale
  //   );
  // }

  // drawName(context, slot) {
  //   const pokemon = slot.content;
  //   context.fillText(pokemon.name, slot.position.x + 15, slot.position.y + 25);
  // }

  // drawLevel(context, slot) {
  //   const pokemon = slot.content;
  //   context.fillText("N.", slot.position.x + 15, slot.position.y + 45);
  //   context.fillText(pokemon.level, slot.position.x + 25, slot.position.y + 45);
  // }

  // drawGender(context, slot) {
  //   const pokemon = slot.content;

  //   context.fillText(
  //     pokemon.gender,
  //     slot.position.x + 80,
  //     slot.position.y + 45
  //   );
  // }

  draw(context) {
    // context.drawImage(
    //   this.backgImg,
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );
    // this.drawPokemons(context);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    this.slots.forEach((slot) => slot.update(context));
    if (!this.isOpen || !this.hasFocus) return;

    switch (action) {
      case "UP":
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case "DOWN":
        if (this.currentIndex < this.pokemons.length - 1) this.currentIndex++;
        break;

      case "ACTION":
        this.openItem();
        break;

      case "MENU":
        this.close();
        break;

      case "ESCAPE":
        this.game.closeCurrentScreen();
        break;
    }
  }
}
