import { partySummaryBackgImg } from "../../../../../../assets/images/ui/ui.asset.js";
import { BALL_CONFIG } from "../../../../../../render/config/item/ball/ball.config.js";
import { SUMMARY_SLOT_CONFIG } from "../../../../../../shareds/pokemon/configs/summary/slot/summarySlot.config.js";
import { drawText } from "../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../shareds/utils/font/font.utils.js";
import { getAnimationConfig } from "../../../../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { getSpeciesData } from "../../../../../../shareds/utils/pokemon/species/species.utils.js";
import { Slot } from "../../../../../Slot/Slot.model.js";
import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";

export class BasePokemonSummary {
  constructor(game, pokemon) {
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
      getAnimationConfig(this.pokemon.id, "front"),
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
    this.drawSpriteViewerInfos(context);
  }

  drawSpriteViewerInfos(context) {
    textParams(context, "20");

    this.drawLvl(context);
    this.drawName(context);
    this.drawGender(context);
    this.drawBall(context);
  }

  drawLvl(context) {
    drawText(context, this.pokemon.level, 5, 20);
  }

  drawName(context) {
    drawText(context, this.species.name, 40, 20);
  }

  drawGender(context) {
    drawText(context, this.pokemon.gender, 150, 20);
  }

  drawBall(context) {
    const BALLS = BALL_CONFIG;
    context.drawImage(
      BALLS[this.pokemon.origin.ball].image,
      145,
      120,
      BALLS.dimensions.width * BALLS.dimensions.scale,
      BALLS.dimensions.height * BALLS.dimensions.scale
    );
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

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);

    this.slot?.update(context);
    this.spriteViewer?.update(context);
  }
}
