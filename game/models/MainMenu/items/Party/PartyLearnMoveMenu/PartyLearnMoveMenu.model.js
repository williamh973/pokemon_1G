import { GAME_STATES } from "../../../../../logic/gameplay/game/states/states.gameplay.js";
import { INPUT_STATE } from "../../../../../logic/input/inputs.state.js";
import { drawBox } from "../../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../shareds/utils/font/font.utils.js";
import { Menu } from "../../../../Menu/Menu.model.js";
import { PokemonMoveSlot } from "../../../../Slot/PokemonMoveSlot/PokemonMoveSlot.model.js";
import { BattleMoveInfo } from "../../../../battle/BattleManager/BattleMenu/BattleMovesMenu/BattleMoveInfos/BattleMoveInfos.model.js";
import { PARTY_PHASES } from "../PartyPhaseManager/partyPhases.database.js";

export class PartyLearnMoveMenu extends Menu {
  constructor(game) {
    super(game);

    this.currentPlayerPokemon = null;
    this.moveToLearn = null;
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = 70;

    this.position = {
      x: 0,
      y: this.canvas.height - this.height - 90,
    };

    this.items = [];
    this.selectedMoveData = null;

    this.slots = [
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
      new PokemonMoveSlot({}),
    ];

    this.learnMod = true;
    this.battleMoveInfo = new BattleMoveInfo(this.learnMod, this.position.y);
  }

  getSlotConfig(index) {
    const col = index % 2;
    const row = Math.floor(index / 2);

    return {
      positionX: this.position.x + 3 + col * 115,
      positionY: this.position.y + 7 + row * 33,
      width: 110,
      height: 28,
    };
  }

  getReturnConfig() {
    return {
      positionX: this.position.x + 3,
      positionY: this.position.y + 73,
      width: 225,
      height: 25,
    };
  }

  setItems() {
    this.items = [];

    this.currentPlayerPokemon?.moves.forEach((move, index) => {
      const slot = this.slots[index];

      slot.config = this.getSlotConfig(index);
      slot.id = `MOVE_SLOT`;

      slot.setMove(move);

      this.items.push(slot);
      console.log(this.items);
    });

    this.items.push({
      id: "RETOUR",
      name: "RETOUR",
      config: this.getReturnConfig(),
    });
  }

  open() {
    this.setItems();

    super.open();

    this.updateSelectedMoveInfos();
  }

  close() {
    this.items = [];
    this.battleMoveInfo.setMove(null);

    super.close();

    const party = this.game.player.party;

    party.hasFocus = true;
    this.game.state = GAME_STATES.PARTY;

    party.partyPhaseManager.setPhase(PARTY_PHASES.REPLACE_MOVE_DIALOG);
  }

  draw(context) {
    this.items.forEach((item, index) => {
      item.isHovered = index === this.currentIndex;

      const { positionX, positionY, width, height } = item.config;

      drawBox(
        context,
        positionX,
        positionY,
        width,
        height,
        item.isHovered ? "red" : "rgba(120, 170, 220, 0.35)",
        "rgba(30, 60, 100, 1)"
      );

      if (item.id === "RETOUR") {
        textParams(context, "20", "rgb(255, 255, 255, 0.9)");

        const returnBtnWidth = context.measureText(item.name).width;
        drawText(
          context,
          item.name,
          item.config.positionX + item.config.width / 2 - returnBtnWidth / 2,
          item.config.positionY + item.config.height / 2
        );
      }
    });
  }

  selectMoveToReplace() {
    const selectedSlot = this.items[this.currentIndex];

    if (!selectedSlot || selectedSlot.id === "RETOUR") return;

    this.game.player.party.partyPhaseManager.replacedMove =
      selectedSlot.content.move;

    this.close();
  }

  openItem() {
    const selectedItem = this.items[this.currentIndex];

    if (!selectedItem) return;

    if (selectedItem.id === "RETOUR") {
      this.game.handleMenuSelection("RETOUR", this);
      return;
    }

    this.selectMoveToReplace();
  }

  updateSelectedMoveInfos() {
    const selectedItem = this.items[this.currentIndex];

    if (!selectedItem || selectedItem.id === "RETOUR") {
      this.battleMoveInfo.setMove(null);
      return;
    }

    this.battleMoveInfo.setMove(selectedItem.content.move);
  }

  update(context, action) {
    if (!this.isOpen || !this.hasFocus) return;

    this.draw(context);

    for (const item of this.items) {
      if (item.update) {
        item.update(context);
      }
    }

    this.updateSelectedMoveInfos();
    this.battleMoveInfo.update(context);

    switch (action) {
      case INPUT_STATE.ACTION:
        this.openItem();
        break;

      case INPUT_STATE.RIGHT:
        if (this.currentIndex === 0) {
          this.currentIndex = 1;
        } else if (this.currentIndex === 2) {
          this.currentIndex = 3;
        }
        break;

      case INPUT_STATE.LEFT:
        if (this.currentIndex === 1) {
          this.currentIndex = 0;
        } else if (this.currentIndex === 3) {
          this.currentIndex = 2;
        }
        break;

      case INPUT_STATE.DOWN:
        if (this.currentIndex === 0) {
          this.currentIndex = 2;
        } else if (this.currentIndex === 1) {
          this.currentIndex = 3;
        } else if (this.currentIndex === 2 || this.currentIndex === 3) {
          this.currentIndex = 4;
        }
        break;

      case INPUT_STATE.UP:
        if (this.currentIndex === 2) {
          this.currentIndex = 0;
        } else if (this.currentIndex === 3) {
          this.currentIndex = 1;
        } else if (this.currentIndex === 4) {
          this.currentIndex = 2;
        }
        break;

      case INPUT_STATE.ESCAPE:
        this.close();
        break;
    }
  }
}
