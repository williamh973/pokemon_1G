import { drawText } from "../../../../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../../../../shareds/utils/font/font.utils.js";
import { ExpBar } from "../../../../../../battle/BattleManager/Hud/ExpBar/ExpBar.model.js";
import { HealthBar } from "../../../../../../battle/BattleManager/Hud/HealthBar/HealthBar.model.js";
import { BasePokemonSummary } from "../BasePokemonSummary.model.js";

export class PokemonSummaryStats extends BasePokemonSummary {
  constructor(game, pokemon) {
    super(game, pokemon);

    this.HPbar = new HealthBar(
      {
        x: this.position.x + 50,
        y: this.position.y + 160,
      },
      this.pokemon.stats.hp,
      this.pokemon.stats.maxHp
    );

    this.expBar = new ExpBar(
      {
        x: this.position.x + 210,
        y: this.position.y + 160,
      },
      this.pokemon.exp,
      this.pokemon
    );
  }

  draw(context) {
    super.draw(context);

    textParams(context, "20");
    this.drawStats(context);

    this.drawExp(context);
    this.drawNextLevelExp(context);
    this.drawNextLevel(context);
  }

  drawStats(context) {
    drawText(context, "ATTAQUE", 185, 20);
    drawText(context, "DEFENSE", 185, 45);
    drawText(context, "ATT.SPE", 185, 70);
    drawText(context, "DEF.SPE", 185, 95);
    drawText(context, "VITESSE", 185, 120);

    context.textAlign = "right";
    drawText(context, this.pokemon.stats.attack, 305, 20);
    drawText(context, this.pokemon.stats.defense, 305, 45);
    drawText(context, this.pokemon.stats.specialAtt, 305, 70);
    drawText(context, this.pokemon.stats.specialDef, 305, 95);
    drawText(context, this.pokemon.stats.speed, 305, 120);
    context.textAlign = "left";
  }

  drawExp(context) {
    drawText(context, "POINTS EXP.", 80, 200);
    context.textAlign = "right";
    drawText(context, this.pokemon.exp, 305, 200);
    context.textAlign = "left";
  }

  drawNextLevel(context) {
    drawText(context, "N. SUIVANT", 80, 225);
    drawText(context, this.pokemon.level + 1, 190, 225);
    drawText(context, ">", 220, 225);
  }

  drawNextLevelExp(context) {
    context.textAlign = "right";
    drawText(context, this.pokemon.nextLevelExp - this.pokemon.exp, 305, 225);
    context.textAlign = "left";
  }

  update(context, action) {
    super.update(context, action);
  }
}
