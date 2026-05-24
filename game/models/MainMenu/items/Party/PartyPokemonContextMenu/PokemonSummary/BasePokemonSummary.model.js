import { partySummaryBackgImg } from "../../../../../../assets/images/ui/ui.asset.js";
import { SUMMARY_SLOT_CONFIG } from "../../../../../../shareds/pokemon/configs/summary/slot/summarySlot.config.js";
import { getSpeciesData } from "../../../../../../shareds/utils/list/list.utils.js";
import { Slot } from "../../../../../Slot/Slot.model.js";
import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";

export class BasePokemonSummary {
  constructor(game, pokemon) {
    this.name = "PARTY_SUMMARY";
    this.game = game;
    this.pokemon = pokemon;
    this.species = getSpeciesData(pokemon.id);
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.isOpen = false;
    this.backgImage = partySummaryBackgImg;
    this.slot = null;
    this.spriteViewer = null;
  }

  openSpriteViewer() {
    this.slot = new Slot(SUMMARY_SLOT_CONFIG);
    this.spriteViewer = new SpriteViewer(
      this.game,
      this.species,
      this.slot,
      "front"
    );
    this.spriteViewer.isOpen = true;
  }

  open() {
    this.isOpen = true;
    this.openSpriteViewer();
  }

  draw(context) {
    this.drawMainBox(context);
  }

  drawMainBox(context) {
    context.drawImage(
      this.backgImage,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);

    this.slot?.update(context);
    this.spriteViewer?.update(context);
  }
}
