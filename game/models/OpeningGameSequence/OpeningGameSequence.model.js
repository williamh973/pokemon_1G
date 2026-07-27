import { openingBackgImage } from "../../assets/images/ui/ui.asset.js";
import {
  GAME_INTRO_PLAYER_FEMALE_RUN,
  GAME_INTRO_PLAYER_MALE_RUN,
} from "../../render/config/gameIntro/gameIntroPlayerSprite.config.js";
import { POKEDEX_DATABASE } from "../../shareds/pokedex/pokedex.database.js";
import { getAnimationConfig } from "../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { Slot } from "../Slot/Slot.model.js";
import { SpriteViewer } from "../SpriteViewer/SpriteViewer.model.js";

export class OpeningGameSequence {
  constructor(game) {
    this.game = game;
    this.canvas = this.game.canvas;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.hasFocus = false;
    this.isFinished = false;
    this.isSpriteInitialPosition = false;
    this.isSpriteStandPosition = false;

    this.pokemonSlot = new Slot({
      positionX: 190,
      positionY: 110,
      width: 100,
      height: 100,
    });
    this.playerSlot = new Slot({
      positionX: 132,
      positionY: 95,
      width: 95,
      height: 100,
    });

    this.spriteViewer = {
      player: null,
      pokemon: null,
    };
    this.playerSprites = [
      GAME_INTRO_PLAYER_MALE_RUN,
      GAME_INTRO_PLAYER_FEMALE_RUN,
    ];

    this.timer = 200;

    this.getPlayerSprite(Math.floor(Math.random() * 2));
    this.getPokemonSprite(Math.floor(Math.random() * 151));
  }

  getPlayerSprite(random2) {
    // this.spriteViewer.player = new SpriteViewer(
    //   this.game,
    //   this.playerSprites[random2],
    //   this.playerSlot
    // );
    // this.spriteViewer.player.isOpen = true;
  }

  getPokemonSprite(random151) {
    if (POKEDEX_DATABASE[random151]?.id) {
      this.spriteViewer.pokemon = new SpriteViewer(
        this.game,
        getAnimationConfig(POKEDEX_DATABASE[random151].id, "front"),
        this.pokemonSlot
      );

      this.setSpriteInitalPositions();

      this.spriteViewer.pokemon.isOpen = true;
    }
  }

  draw(context) {
    context.drawImage(
      openingBackgImage,
      0,
      0,
      openingBackgImage.width,
      openingBackgImage.height
    );
  }

  open() {
    this.isOpen = true;
    this.hasFocus = true;
  }

  setSpriteInitalPositions() {
    this.spriteViewer.pokemon.sprite.position.x =
      0 - this.spriteViewer.pokemon.sprite.config.frameWidth;
  }

  spriteStandPosition() {
    return (
      this.spriteViewer.pokemon.sprite.position.x >=
      this.pokemonSlot.position.x +
        (this.pokemonSlot.width - this.spriteViewer.pokemon.sprite.frameWidth) /
          2
    );
  }

  checkSpriteCanvasOutPosition() {
    return (
      this.spriteViewer.pokemon.sprite.position.x >=
      this.game.canvas.position.x + this.game.canvas.width
    );
  }

  update(context, action) {
    if (!this.isOpen) return;

    if (this.timer > 0) this.timer--;

    if (this.timer <= 0 && !this.isSpriteStandPosition) {
      this.isSpriteInitialPosition = true;

      if (!this.spriteStandPosition() && !this.isSpriteStandPosition)
        this.spriteViewer.pokemon.sprite.position.x += 4;
      else {
        this.isSpriteInitialPosition = false;
      }
    }

    if (this.spriteStandPosition() && !this.isSpriteStandPosition) {
      this.timer = 400;
      this.isSpriteStandPosition = true;
    }

    if (this.timer <= 0 && this.isSpriteStandPosition)
      this.spriteViewer.pokemon.sprite.position.x += 4;

    if (this.checkSpriteCanvasOutPosition()) {
      this.getPokemonSprite(Math.floor(Math.random() * 151));
      this.isSpriteInitialPosition = false;
      this.isSpriteStandPosition = false;
    }

    this.draw(context);

    if (!this.isOpen || !this.hasFocus) return;
    // else {
    //   this.getPokemonSprite(Math.floor(Math.random() * 151));
    //   this.getPlayerSprite(Math.floor(Math.random() * 2));
    //   this.timer = 500;
    // }

    this.spriteViewer?.player?.update(context);
    this.spriteViewer?.pokemon?.update(context);

    switch (action) {
      case "ACTION":
        this.game.openStartMenu();
        break;
    }
  }
}
