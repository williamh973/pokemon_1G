import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";
import { getAnimationConfig } from "../../../../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";

export class PokemonAppearsSequence {
  constructor(game, viewers, firstPlayerPokemon, backSlot) {
    this.game = game;
    this.viewers = viewers;
    this.firstPlayerPokemon = firstPlayerPokemon;
    this.backSlot = backSlot;
    this.isFinished = false;
  }

  start() {
    this.viewers.back = new SpriteViewer(
      this.game,
      getAnimationConfig(this.firstPlayerPokemon.id, "back"),
      this.backSlot
    );
    this.maxSpriteScale = this.viewers.back.sprite.scale;

    this.viewers.back.sprite.scale = 0.1;

    this.viewers.back.isOpen = true;
  }

  update() {
    if (this.viewers.back.sprite.scale >= this.maxSpriteScale) {
      this.isFinished = true;
      return;
    }
    this.viewers.back.sprite.scale += 0.1;
    this.updateSpritePosition();
  }

  updateSpritePosition() {
    const sprite = this.viewers.back.sprite;

    const width = sprite.frameWidth * sprite.scale;
    const height = sprite.frameHeight * sprite.scale;

    sprite.position.x =
      this.backSlot.position.x + (this.backSlot.width - width) / 2;

    sprite.position.y =
      this.backSlot.position.y + (this.backSlot.height - height) / 2;
  }
}
