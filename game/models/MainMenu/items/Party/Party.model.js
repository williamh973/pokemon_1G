import { partyBackgImg } from "../../../../assets/images/ui/ui.asset.js";
import { PARTY_SLOT_CONFIG } from "../../../../logic/gameplay/character/player/party/partySlots.config.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { PokemonPartySlot } from "../../../Slot/PokemonPartySlot/PokemonPartySlot.model.js";
import { PokemonContextMenu } from "./PartyPokemonContextMenu/PartyPokemonContextMenu.model.js";

export class Party {
  constructor(game) {
    this.game = game;
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
    this.timer = 60;
    this.contextMenu = null;
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
    this.game.openPlayerMenu();
  }

  close() {
    this.hasFocus = false;
    this.isOpen = false;
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

  openContextMenu() {
    this.hasFocus = false;

    const slot = this.slots.find((slot, index) => {
      return slot.content && index === this.currentIndex;
    });

    this.contextMenu = new PokemonContextMenu(this.game, slot.content);
    this.contextMenu.open();
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    this.slots.forEach((slot) => slot.update(context));

    this.slots.forEach((slot, index) => {
      slot.isHovered = index === this.currentIndex;
    });

    this.contextMenu?.update(context, action);

    if (!this.isOpen || !this.hasFocus) return;
    switch (action) {
      case "UP":
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case "DOWN":
        const filledSlots = this.slots.filter((slot) => slot.content);

        if (this.currentIndex < filledSlots.length - 1) {
          this.currentIndex++;
        }
        break;

      case "ACTION":
        this.openContextMenu();
        break;

      case GAME_STATES.PLAYER_MENU:
      case INPUT_STATE.ESCAPE:
        this.game.closeAndReturnFromSubMenu();
        break;
    }
  }
}
