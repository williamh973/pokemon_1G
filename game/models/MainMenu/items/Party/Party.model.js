import { partyBackgImg } from "../../../../assets/images/ui/ui.asset.js";
import { PARTY_SLOT_CONFIG } from "../../../../logic/gameplay/character/player/party/partySlots.config.js";
import { PokemonPartySlot } from "../../../Slot/PokemonPartySlot/PokemonPartySlot.model.js";

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
    this.slots = [];
    this.height = this.canvas.height;
    this.hasFocus = false;
    this.maxCount = 6;
    this.minCount = 1;
    this.currentIndex = 0;
    this.baseY = 21;
    this.initSlots();
  }

  initSlots() {
    this.slots.push(
      new PokemonPartySlot(PARTY_SLOT_CONFIG.first),
      new PokemonPartySlot(PARTY_SLOT_CONFIG.second),
      new PokemonPartySlot(PARTY_SLOT_CONFIG.third),
      new PokemonPartySlot(PARTY_SLOT_CONFIG.fourth),
      new PokemonPartySlot(PARTY_SLOT_CONFIG.fifth),
      new PokemonPartySlot(PARTY_SLOT_CONFIG.sixth)
    );
  }

  addPokemonToFirstEmptySlot(pokemon) {
    const emptySlot = this.slots.find((slot) => slot.content === null);
    if (!emptySlot) return false;

    emptySlot.setPokemon(pokemon);
    return true;
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

  draw(context) {
    this.drawBackgImage(context);
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

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    this.slots.forEach((slot) => slot.update(context));

    this.slots.forEach((slot, index) => {
      slot.isHovered = index === this.currentIndex;
    });

    if (!this.isOpen || !this.hasFocus) return;
    switch (action) {
      case "UP":
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case "DOWN":
        console.log(this.currentIndex);
        const filledSlots = this.slots.filter((slot) => slot.content);
        if (this.currentIndex < this.slots.length - 1 && filledSlots)
          this.currentIndex++;
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
