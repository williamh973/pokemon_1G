import { POKEDEX_DATABASE } from "../../shareds/pokedex/pokedex.database.js";
import { POKEMON_IDLE_ANIMATIONS } from "../../shareds/pokemon/animations/idle/pokemonIdleAnimation.database.js";
import { drawBox } from "../../shareds/utils/box/box.utils.js";
import { AnimatedSprite } from "../AnimationSprite/AnimationSprite.model.js";

export class PokemonViewer {
  constructor(game, selectedPokemon = null) {
    this.isOpen = false;
    this.game = game;
    this.pokemon = this.getSelectedPokemonInPokedexDB(selectedPokemon);
    this.animKey = this.pokemon.animations?.idle;
    this.animObject = Object.assign(
      POKEMON_IDLE_ANIMATIONS[this.pokemon.id][this.animKey]
    );
    this.pokemonSprite = new AnimatedSprite(game, this.animObject);
  }

  getSelectedPokemonInPokedexDB(selectedPokemon) {
    this.pokemon = POKEDEX_DATABASE.find((pokemon) => {
      return pokemon.name === selectedPokemon.name;
    });
    return this.pokemon;
  }

  update(context) {
    if (!this.isOpen) return;
    this.draw(context);
    this.pokemonSprite.update(context);
  }

  draw(context) {
    context.globalAlpha = 0.8;
    this.game.currentScreen?.name === "POKEDEX"
      ? drawBox(context, 15, 15, 120, 120, "black", "black")
      : drawBox(context, 112, 95, 95, 100, "purple", "black");
    context.globalAlpha = 1;
  }
}
