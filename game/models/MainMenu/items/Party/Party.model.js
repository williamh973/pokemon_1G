import { partyBackgImg } from "../../../../assets/images/ui/ui.asset.js";
import { PARTY_SLOT_CONFIG } from "../../../../logic/gameplay/character/player/party/partySlots.config.js";
import { GAME_STATES } from "../../../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../../../logic/input/inputs.state.js";
import { PokemonPartySlot } from "../../../Slot/PokemonPartySlot/PokemonPartySlot.model.js";
import { StatsBox } from "../../../pokemon/StatsBox/StatsBox.model.js";
import { PartyPhaseManager } from "./PartyPhaseManager/PartyPhaseManager.model.js";
import { PartyContextMenu } from "./PartyPokemonContextMenu/PartyContextMenu.model.js";

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
    this.hasFocus = false;
    this.usedItem = null;
    this.backgImg = partyBackgImg;
    this.slots = [];
    this.height = this.canvas.height;
    this.currentIndex = 0;
    this.baseY = 21;
    this.contextMenu = null;
    this.statsBox = null;
    this.selectedPokemon = null;
    this.partyPhaseManager = null;
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

  addTrainerId(pastPokemon) {
    const newPokemon = {
      ...pastPokemon,
      trainerId: this.game.player.trainerId,
    };
    return newPokemon;
  }

  addPokemonToFirstEmptySlot(pokemon) {
    const addedPokemon = this.addTrainerId(pokemon);

    const emptySlot = this.slots.find((slot) => slot.content === null);
    if (!emptySlot) return false;

    emptySlot.setPokemon(addedPokemon);
    return true;
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
  }

  openMainMenu() {
    this.game.openPlayerMenu();
  }

  openContextMenu() {
    this.hasFocus = false;

    const slot = this.slots.find((slot, index) => {
      return slot.content && index === this.currentIndex;
    });

    this.contextMenu = new PartyContextMenu(
      this.game,
      slot.content,
      this.usedItem
    );
    this.contextMenu.open();
  }

  closeContextMenu() {
    this.contextMenu = null;
    this.hasFocus = true;
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

  applyUsedItemEffect() {
    this.contextMenu.close();
    this.partyPhaseManager = new PartyPhaseManager(
      this,
      this.game,
      this.usedItem,
      this.slots[this.currentIndex]
    );
    this.handlePhaseResult(this.partyPhaseManager.begin());
  }

  handlePhaseResult(result) {
    if (!result) return;

    if (result.stats) {
      this.statsBox = new StatsBox(
        this.game,
        {
          pastStats: result.stats.pastStats,
          newStats: result.stats.newStats,
        },
        {
          x: 50,
          y: 50,
        }
      );
    }

    if (result.dialog) this.game.dialogBox.open(result.dialog);

    if (result.closeStats && this.statsBox) {
      this.statsBox.isOpen = false;
      this.statsBox = null;
    }

    if (result.next) result.next();

    if (result.closeDialog) this.game.dialogBox.close();

    if (result.finished) this.partyPhaseManager = null;

    this.usedItem = null;
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.draw(context);

    this.slots.forEach((slot, index) => {
      slot.isHovered = index === this.currentIndex;
      slot.update(context);
    });

    if (this.contextMenu?.isOpen) this.contextMenu.update(context, action);
    else this.hasFocus = true;

    this.statsBox?.update(context, action);

    this.game.dialogBox?.update(this.game.canvas.context, action);

    if (!this.isOpen || !this.hasFocus) return;

    switch (action) {
      case INPUT_STATE.UP:
        if (this.currentIndex > 0) this.currentIndex--;
        break;

      case INPUT_STATE.DOWN:
        const filledSlots = this.slots.filter((slot) => slot.content);

        if (this.currentIndex < filledSlots.length - 1) this.currentIndex++;
        break;

      case INPUT_STATE.ACTION:
        if (this.partyPhaseManager) {
          const result = this.partyPhaseManager.next();
          this.handlePhaseResult(result);

          if (result?.nextPhase) {
            const nextResult = this.partyPhaseManager.next();
            this.handlePhaseResult(nextResult);
          }
        } else {
          this.openContextMenu();
        }

        break;

      case GAME_STATES.PLAYER_MENU:
      case INPUT_STATE.ESCAPE:
        this.game.closeAndReturnFromSubMenu();
        break;
    }
  }
}
