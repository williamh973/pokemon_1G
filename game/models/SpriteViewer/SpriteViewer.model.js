import { POKEMON_IDLE_ANIMATIONS } from "../../shareds/pokemon/animations/idle/pokemonIdleAnimation.database.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../AnimationSprite/AnimationSprite.model.js";

export class SpriteViewer {
  constructor(game, selectedPokemon = null, slot, key) {
    // console.log(selectedPokemon); // affiche null plutot que le content du slot
    this.isOpen = false;
    this.game = game;
    this.selectedPokemon = selectedPokemon;
    this.animKey = this.selectedPokemon.animations?.idle[key];

    this.animeConfig = // l'id est le nom en anglais
      POKEMON_IDLE_ANIMATIONS[this.selectedPokemon.id][this.animKey];

    // POUR TEST UNIQUEMENT
    // this.animeConfig =
    //   POKEMON_IDLE_ANIMATIONS["gyarados"]["gyarados_front_idle"];

    const getSlotCenterPositions = slot.center(
      this.animeConfig.frameWidth,
      this.animeConfig.frameHeight
    );
    this.setPositions(this.game, getSlotCenterPositions);
  }

  spritePosition(posX = 0, posY = 0) {
    this.pokemonSprite = new AnimatedSprite({
      ...this.animeConfig,
      x: posX,
      y: posY,
    });
  }

  setPositions(game, positions) {
    switch (game.currentScreen?.name) {
      case "POKEDEX":
        this.spritePosition(positions.x, positions.y);
        break;
      case "BATTLE":
        this.spritePosition(positions.x, positions.y);
        break;
      case "CHOICE_MENU":
        this.spritePosition(positions.x, positions.y);
        break;
      default:
        this.spritePosition(positions.x, positions.y);
        break;
    }
  }

  update(context) {
    if (!this.isOpen) return;

    this.draw(context);
    this.pokemonSprite.update(context);
  }

  draw(context) {
    switch (this.game.currentScreen.name) {
      case "POKEDEX":
        context.globalAlpha = 0.8;
        drawBox(context, 15, 15, 120, 120, "black", "black"); // dessine un fond derriere le sprite
        break;
      case "BATTLE":
        // Pas de fond. Ca fonctionne
        break;
      case "START_GAME":
        context.globalAlpha = 0.8;
        drawBox(context, 112, 95, 95, 100, "purple", "black");
        break;
      default:
        break;
    }
    context.globalAlpha = 1;
  }
}
