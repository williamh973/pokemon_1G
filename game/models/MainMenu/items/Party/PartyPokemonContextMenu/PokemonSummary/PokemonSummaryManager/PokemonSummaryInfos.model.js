import { TYPES_CONFIG } from "../../../../../../../render/config/pokemon/type/types.config.js";
import { drawText } from "../../../../../../../shareds/utils/font/drawText.utils.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummaryInfos extends BasePokemonSummary {
  constructor(game, pokemon = "") {
    super(game, pokemon);
  }

  draw(context) {
    super.draw(context);

    this.drawRightSideInfos(context);
    this.drawEncounterInfos(context);
    this.drawNature(context);
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
    drawText(context, this.species.pokedexId, 245, 20);
  }

  types(context) {
    drawText(context, "TYPE", 185, 45);

    const TYPES = TYPES_CONFIG;
    this.species.types.forEach((type, index) => {
      context.drawImage(
        TYPES[type].image,
        245 + 40 * index,
        49,
        TYPES.dimensions.width * TYPES.dimensions.scale,
        TYPES.dimensions.height * TYPES.dimensions.scale
      );
    });
  }

  playerName(context) {
    drawText(context, "OT", 185, 70);
    drawText(context, this.pokemon.origin.caughtBy, 245, 70);
  }

  trainerId(context) {
    drawText(context, "IDNo", 185, 95);
    drawText(context, this.pokemon.trainerId, 245, 95);
  }

  item(context) {
    drawText(context, "OBJET", 185, 120);
    drawText(context, this.pokemon.item, 245, 120);
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
