import { TYPES_CONFIG } from "../../../../../../../render/config/pokemon/type/types.config.js";
import { drawText } from "../../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../../shareds/utils/font/font.utils.js";
import { BALL_CONFIG } from "../../../../../../../render/config/item/ball/ball.config.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummaryFirst extends BasePokemonSummary {
  constructor(game, pokemon = "") {
    super(game, pokemon);
  }

  resetFocus() {
    this.hasFocus = false;
  }

  draw(context) {
    super.draw(context);
    this.drawSpriteViewerInfos(context);
    this.drawRightSideInfos(context);
    this.drawEncounterInfos(context);
    this.drawNature(context);
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

  drawRightSideInfos(context) {
    this.pokedexId(context);
    this.types(context);
    this.playerName(context);
    this.trainerId(context);
    this.item(context);
  }

  pokedexId(context) {
    drawText(context, "No", 185, 20);
    drawText(context, this.species.pokedexId, 220, 20);
  }

  types(context) {
    drawText(context, "TYPE", 185, 45);

    const TYPES = TYPES_CONFIG;
    this.species.types.forEach((type, index) => {
      context.drawImage(
        TYPES[type].image,
        230 + 40 * index,
        49,
        TYPES.dimensions.width * TYPES.dimensions.scale,
        TYPES.dimensions.height * TYPES.dimensions.scale
      );
    });
  }

  playerName(context) {
    drawText(context, "OT", 185, 70);
    drawText(context, this.pokemon.origin.caughtBy, 230, 70);
  }

  trainerId(context) {
    drawText(context, "IDNo", 185, 95);
    drawText(context, this.pokemon.trainerId, 230, 95);
  }

  item(context) {
    drawText(context, "OBJET", 185, 120);
    drawText(context, this.pokemon.item, 230, 120);
  }

  drawEncounterInfos(context) {
    drawText(context, "Rencontré à " + this.pokemon.origin.caughtAt, 15, 160);
    drawText(context, "au N." + this.pokemon.level, 15, 180);
  }

  drawNature(context) {
    drawText(context, "Nature : Modeste", 15, 210);
  }

  update(context, action) {
    super.update(context, action);
  }
}
