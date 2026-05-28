import { TYPES_CONFIG } from "../../../../../../../render/config/pokemon/type/types.config.js";
import { drawText } from "../../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../../shareds/utils/font/font.utils.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummaryMoves extends BasePokemonSummary {
  constructor(game, pokemon) {
    super(game, pokemon);
  }

  draw(context) {
    super.draw(context);

    textParams(context, "20");
    this.drawMoves(context);
    this.drawMovesInfos(context);
  }

  drawMoves(context) {
    const paddingY = 50;
    this.pokemon.moves.forEach((move, index) => {
      const TYPES = TYPES_CONFIG;

      context.drawImage(
        TYPES[move.type].image,
        185,
        21 + paddingY * index,
        TYPES.dimensions.width * TYPES.dimensions.scale,
        TYPES.dimensions.height * TYPES.dimensions.scale
      );

      drawText(context, move.name, 225, 20 + paddingY * index);

      drawText(context, "PP", 240, 40 + paddingY * index);
      drawText(context, move.currentPP, 265, 40 + paddingY * index);
      drawText(context, "/", 285, 40 + paddingY * index);
      drawText(context, move.maxPP, 295, 40 + paddingY * index);
    });
  }

  drawMovesInfos(context) {}

  update(context, action) {
    super.update(context, action);
  }
}
