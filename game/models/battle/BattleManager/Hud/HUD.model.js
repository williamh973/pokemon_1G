import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
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
      this,
      this.pokemon.stats.hp,
      this.pokemon.stats.maxHp
    );
    this.expBar = new ExpBar(this, this.pokemon);
  }

  setHudHeight(hudParams) {
    const expBar = 10;
    if (this.isPlayerHUD) this.height = hudParams.height + expBar;
    else this.height = hudParams.height;
  }

  drawName(context) {
    const paddingX = 5;
    const paddingY = 5;

    context.fillText(
      this.pokemon.name,
      this.position.x + paddingX,
      this.position.y + paddingY
    );
  }

  drawLevel(context) {
    const paddingX = 120;
    const paddingY = 5;

    const levelWidth = context.measureText(this.pokemon.level).width;

    context.fillText(
      this.pokemon.level,
      this.position.x + paddingX - levelWidth + 5,
      this.position.y + paddingY
    );

    context.fillText(
      "N.",
      this.position.x + paddingX - levelWidth - 5,
      this.position.y + paddingY
    );
  }

  drawGender(context) {
    const paddingX = 5;
    const nameWidth = context.measureText(this.pokemon.name).width;
    const paddingY = 9;
    context.fillText(
      this.pokemon.gender,
      this.position.x + paddingX + nameWidth + 25,
      this.position.y + paddingY
    );
  }

  drawPokemonDatas(context) {
    textParams(context, "18", "whitesmoke");
    this.drawName(context);
    this.drawLevel(context);
    this.drawHP(context);

    textParams(context, "12", "whitesmoke");
    this.drawGender(context);
  }

  drawHP(context) {
    context.fillText("PV", this.position.x + 32, this.position.y + 22);

    const currentHpWidth = context.measureText(this.pokemon.stats.hp).width;

    context.fillText(
      this.pokemon.stats.hp,
      this.position.x + 80 - currentHpWidth,
      this.position.y + 35
    );
    context.fillText("/", this.position.x + 85, this.position.y + 35);
    context.fillText(
      this.pokemon.stats.maxHp,
      this.position.x + 95,
      this.position.y + 35
    );
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
