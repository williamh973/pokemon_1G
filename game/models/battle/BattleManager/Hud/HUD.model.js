import { drawBox } from "../../../../shareds/utils/box/box.utils.js";
import { HealthBar } from "./HealthBar/HealthBar.model.js";

export class HUD {
  constructor(pokemon, params) {
    this.position = {
      x: params.x,
      y: params.y,
    };
    this.width = params.width;
    this.height = params.height;
    this.pokemon = pokemon;
    this.HPbar = new HealthBar(
      this,
      this.pokemon.stats.hp,
      this.pokemon.stats.maxHp
    );
  }

  fontParams(context, weight) {
    context.font = `${weight}px PixelOperator `;
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
    const nameWidth = context.measureText(this.pokemon.name).width;
    const paddingX = 25;
    const paddingY = 9;

    context.fillText(
      this.pokemon.gender,
      this.position.x + paddingX + nameWidth,
      this.position.y + paddingY
    );
  }

  drawPokemonDatas(context) {
    this.drawName(context);
    this.drawLevel(context);

    this.fontParams(context, "12");

    this.drawGender(context);

    this.fontParams(context, "19");

    context.fillText("PV", this.position.x + 30, this.position.y + 25);

    const currentHpWidth = context.measureText(this.pokemon.stats.hp).width;

    context.fillText(
      this.pokemon.stats.maxHp,
      this.position.x + 75 - currentHpWidth,
      this.position.y + 40
    );
    context.fillText("/", this.position.x + 80, this.position.y + 40);
    context.fillText(
      this.pokemon.stats.maxHp,
      this.position.x + 90,
      this.position.y + 40
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

    this.fontParams(context, "18");
    context.fillStyle = "rgba(250,250,250, 0.9)";

    this.drawPokemonDatas(context);
  }

  update(context) {
    this.draw(context);
    this.HPbar?.update(context);
  }
}
