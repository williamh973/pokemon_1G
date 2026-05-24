import { drawText } from "../../../../../../../shareds/utils/font/drawText.utils.js";
import { getSpeciesLearnsets } from "../../../../../../../shareds/utils/list/list.utils.js";
import { ExpBar } from "../../../../../../battle/BattleManager/Hud/ExpBar/ExpBar.model.js";
import { HealthBar } from "../../../../../../battle/BattleManager/Hud/HealthBar/HealthBar.model.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummarySecond extends BasePokemonSummary {
  constructor(game, pokemon) {
    super(game, pokemon);

    this.HPbar = new HealthBar(
      {
        x: this.position.x + 55,
        y: this.position.y + 29,
      },
      this.pokemon.stats.hp,
      this.pokemon.stats.maxHp
    );
    this.expBar = new ExpBar(this, this.pokemon);
  }

  drawMoves(context) {
    const learnsets = getSpeciesLearnsets(this.species, this.pokemon.level);
    const paddingY = 40;
    learnsets.forEach((learnset, index) => {
      drawText(context, learnset.move.name, 15, 250 + paddingY * index);
    });
  }

  draw(context) {
    super.draw(context);
    this.drawMoves(context);
  }

  update(context, action) {
    super.update(context, action);
  }
}
