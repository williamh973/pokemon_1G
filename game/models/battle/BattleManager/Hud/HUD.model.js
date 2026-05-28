import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
import { drawText } from "../../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../../shareds/utils/font/font.utils.js";
import { ExpBar } from "./ExpBar/ExpBar.model.js";
import { HealthBar } from "./HealthBar/HealthBar.model.js";

export class HUD {
  constructor(pokemon, hudParams) {
    this.position = {
      x: hudParams.x,
      y: hudParams.y,
    };
    this.isPlayerHUD = hudParams.isPlayerHUD;
    this.width = hudParams.width;
    this.setHudHeight(hudParams);
    this.pokemon = pokemon;
    this.HPbar = new HealthBar(
      {
        x: this.position.x + 55,
        y: this.position.y + 29,
      },
      this.pokemon.stats.hp,
      this.pokemon.stats.maxHp
    );
    this.expBar = new ExpBar(
      {
        x: this.position.x + 34,
        y: this.position.y + 57,
      },
      this.pokemon
    );
  }

  setHudHeight(hudParams) {
    const expBar = 10;
    if (this.isPlayerHUD) this.height = hudParams.height + expBar;
    else this.height = hudParams.height;
  }

  drawName(context) {
    drawText(
      context,
      this.pokemon.name,
      this.position.x + 5,
      this.position.y + 5
    );
  }

  drawLevel(context) {
    const paddingX = 120;
    const paddingY = 5;

    const levelWidth = context.measureText(this.pokemon.level).width;

    drawText(
      context,
      this.pokemon.level,
      this.position.x + 120 - levelWidth + 5,
      this.position.y + 5
    );

    drawText(
      context,
      "N.",
      this.position.x + 120 - levelWidth - 5,
      this.position.y + 5
    );
  }

  drawGender(context) {
    const nameWidth = context.measureText(this.pokemon.name).width;
    drawText(
      context,
      this.pokemon.gender,
      this.position.x + 5 + nameWidth + 25,
      this.position.y + 9
    );
  }

  drawPokemonDatas(context) {
    textParams(context, "18", "whitesmoke");
    this.drawName(context);
    this.drawLevel(context);

    textParams(context, "12", "whitesmoke");
    this.drawGender(context);
  }

  draw(context) {
    drawBox(
      context,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      "transparent",
      "rgba(0,0,0, 0.8)"
    );

    this.drawPokemonDatas(context);
  }

  update(context) {
    this.draw(context);
    this.HPbar?.update(context);
    if (this.isPlayerHUD) this.expBar?.update(context);
  }
}
