import { ICON_CONFIG_DATABASE } from "../../../shareds/pokemon/configs/icons/iconConfig.database.js";
import { textParams } from "../../../shareds/utils/font/font.utils.js";
import { HealthBar } from "../../battle/BattleManager/Hud/HealthBar/HealthBar.model.js";
import { Slot } from "../Slot.model.js";

export class PokemonPartySlot extends Slot {
  constructor(config) {
    super(config);
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
    const configIcon = ICON_CONFIG_DATABASE[pokemon.id];
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
    context.fillText(
      pokemon.name,
      this.position.x + basePaddingX,
      this.position.y
    );
  }

  drawLevel(context, pokemon, basePaddingX, nameWidth) {
    context.fillText(
      "N.",
      this.position.x + basePaddingX + nameWidth / 3,
      this.position.y + this.height / 1.5
    );

    context.fillText(
      pokemon.level,
      this.position.x + basePaddingX + nameWidth / 3 + 15,
      this.position.y + this.height / 1.5
    );
  }

  drawGender(context, pokemon, basePaddingX, nameWidth) {
    context.fillText(
      pokemon.gender,
      this.position.x + basePaddingX + nameWidth + 5,
      this.position.y + this.height / 2
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

  update(context) {
    super.update(context);

    this.drawPokemon(context);
    if (this.HPbar) this.HPbar?.update(context);
  }
}
