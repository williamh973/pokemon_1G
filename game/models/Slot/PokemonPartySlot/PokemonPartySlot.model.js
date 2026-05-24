import { POKEMON_ICON_CONFIG_DATABASE } from "../../../shareds/pokemon/configs/icons/iconConfig.database.js";
import { drawText } from "../../../shareds/utils/font/drawText.utils.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";
import { HealthBar } from "../../battle/BattleManager/Hud/HealthBar/HealthBar.model.js";
import { Slot } from "../Slot.model.js";

export class PokemonPartySlot extends Slot {
  constructor(config) {
    super(config);

    this.HPbar = null;
  }

  initHPbar() {
    this.HPbar = new HealthBar(
      {
        x: this.position.x + 179,
        y: this.position.y + this.height / 2,
      },
      this.content?.stats.hp,
      this.content?.stats.maxHp
    );
  }

  setPokemon(pokemon) {
    this.content = pokemon;

    this.HPbar = new HealthBar(
      {
        x: this.position.x + 179,
        y: this.position.y + this.height / 2,
      },
      pokemon.stats.hp,
      pokemon.stats.maxHp
    );
  }

  drawPokemon(context) {
    if (!this.content) return;

    textParams(context, "19", "white");

    const pokemon = this.content;
    const nameWidth = context.measureText(pokemon.name).width;

    const basePaddingX = 40;
    this.drawIcon(context, pokemon);
    this.drawName(context, pokemon, basePaddingX);
    this.drawLevel(context, pokemon, basePaddingX, nameWidth);
    this.drawGender(context, pokemon, basePaddingX, nameWidth);
  }

  drawIcon(context, pokemon) {
    const configIcon = POKEMON_ICON_CONFIG_DATABASE[pokemon.id];
    const image = configIcon.image;
    context.drawImage(
      image,
      this.position.x - 15,
      this.position.y - 15,
      configIcon.width,
      configIcon.height
    );
  }

  drawName(context, pokemon, basePaddingX) {
    drawText(
      context,
      pokemon.name,
      this.position.x + basePaddingX,
      this.position.y
    );
  }

  drawLevel(context, pokemon, basePaddingX, nameWidth) {
    drawText(
      context,
      "N.",
      this.position.x + basePaddingX + nameWidth / 3,
      this.position.y + this.height / 1.5
    );

    drawText(
      context,
      pokemon.level,
      this.position.x + basePaddingX + nameWidth / 3 + 15,
      this.position.y + this.height / 1.5
    );
  }

  drawGender(context, pokemon, basePaddingX, nameWidth) {
    drawText(
      context,
      pokemon.gender,
      this.position.x + basePaddingX + nameWidth + 5,
      this.position.y + this.height / 2
    );
  }

  update(context) {
    super.update(context);

    this.drawPokemon(context);
    if (this.content && this.HPbar) this.HPbar?.update(context);
  }
}
