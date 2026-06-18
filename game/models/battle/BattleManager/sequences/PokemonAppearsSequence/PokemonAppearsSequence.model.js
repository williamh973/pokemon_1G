import { createSprite } from "../../../../../shareds/utils/battle/createSprite.utils.js";

export class PokemonAppearsSequence {
  constructor(game, viewers, pokemon, key) {
    this.game = game;
    this.viewers = viewers;
    this.pokemon = pokemon;
    this.key = key;

    this.slot = this.viewers[this.key].slot;
    this.isFinished = false;

    this.viewers[this.key] = createSprite({
      game: this.game,
      viewer: this.viewers[this.key],
      pokemonId: this.pokemon.id,
      key: this.key,
      slot: this.slot,
    });
  }

  start() {
    this.maxSpriteScale = this.viewers[this.key].sprite.scale;

    this.viewers[this.key].sprite.scale = 0.1;

    this.viewers[this.key].isOpen = true;
  }

  update() {
    // console.log(
    //   "this.maxSpriteScale",
    //   this.maxSpriteScale,
    //   "isFinished",
    //   this.isFinished
    // );

    if (this.viewers[this.key].sprite.scale >= this.maxSpriteScale) {
      this.isFinished = true;
      return;
    }
    this.viewers[this.key].sprite.scale += 0.1;
    this.updateSpritePosition();
  }

  updateSpritePosition() {
    const sprite = this.viewers[this.key].sprite;

    const width = sprite.frameWidth * sprite.scale;
    const height = sprite.frameHeight * sprite.scale;

    sprite.position.x = this.slot.position.x + (this.slot.width - width) / 2;

    sprite.position.y = this.slot.position.y + (this.slot.height - height) / 2;
  }
}
