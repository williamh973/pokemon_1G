import { POKEDEX_DATABASE } from "../../shareds/pokedex/pokedex.database.js";
import { POKEMON_IDLE_ANIMATIONS } from "../../shareds/pokemon/animations/idle/pokemonIdleAnimation.database.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../AnimationSprite/AnimationSprite.model.js";

export class PokemonViewer {
  constructor(game, selectedPokemon = null, slot, key) {
    this.isOpen = false;
    this.game = game;
    const pokemon = this.getSelectedPokemonFromPokedexDB(selectedPokemon);

    this.animKey = pokemon.animations?.idle[key];
    this.animeConfig = POKEMON_IDLE_ANIMATIONS[pokemon.id][this.animKey];

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

  getSelectedPokemonFromPokedexDB(selectedPokemon) {
    const foundedPokemon = POKEDEX_DATABASE.find((pokemon) => {
      return pokemon.id === selectedPokemon.pokedexId;
    });
    return foundedPokemon;
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
      case "TITLE":
        context.globalAlpha = 0.8;
        drawBox(context, 112, 95, 95, 100, "purple", "black");
        break;
      default:
        break;
    }
    context.globalAlpha = 1;
  }
}
