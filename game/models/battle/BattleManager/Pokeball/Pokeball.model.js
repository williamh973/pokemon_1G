import { POKEBALL_STATES } from "../../../../logic/gameplay/battle/pokeball/pokeball.states.js";
import { OPENED_POKEBALL_ANIMATION } from "../../../../render/config/battle/openedPokeball.config.js";
import { BALL_CONFIG } from "../../../../render/config/item/ball/ball.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";
import { PokeballReleaseEffect } from "./PokeballReleaseEffect/PokeballReleaseEffect.model.js";

export class Pokeball {
  constructor(
    game,
    params,
    targetSlot,
    randoms,
    secondFormulaValue,
    isCatchMod
  ) {
    this.state = POKEBALL_STATES.THROW;
    this.game = game;
    this.position = { ...params.position };
    this.vx = params.vx;
    this.vy = params.vy;
    this.gravity = params.gravity;
    this.angle = params.angle;
    this.targetSlot = targetSlot;
    this.randoms = randoms;
    this.secondFormulaValue = secondFormulaValue;
    this.isCatchMod = isCatchMod;
    this.image = BALL_CONFIG.POKEBALL.image;
    this.width = BALL_CONFIG.dimensions.width;
    this.height = BALL_CONFIG.dimensions.height;
    this.scale = BALL_CONFIG.dimensions.scale + 0.3;
    this.viewer = null;
    this.timer = 40;
  }

  showOpenedPokeball() {
    this.viewer = {
      front: new SpriteViewer(
        this.game,
        OPENED_POKEBALL_ANIMATION,
        this.targetSlot
      ),
    };

    this.viewer.front.sprite.position.x = this.position.x - 11;
    this.viewer.front.sprite.position.y = this.position.y - 13;

    this.viewer.front.isOpen = true;
  }

  createPokeballReleaseEffect() {
    this.state = POKEBALL_STATES.RELEASE;

    this.pokeballReleaseEffect = new PokeballReleaseEffect(
      this.targetSlot.position.x + this.targetSlot.width / 2,
      this.targetSlot.position.y + this.targetSlot.height / 2
    );
  }

  draw(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);

    context.drawImage(
      this.image,
      (-this.width * this.scale) / 2,
      (-this.height * this.scale) / 2,
      this.width * this.scale,
      this.height * this.scale
    );

    context.restore();
  }

  updatePositionForOpen(backSlotPosX, backSlotPosY) {
    this.position.x = backSlotPosX;
    this.position.y = backSlotPosY;
  }

  checkForImpact(backSlotPosX, backSlotPosY) {
    if (this.position.x >= backSlotPosX && this.position.y >= backSlotPosY)
      this.state = POKEBALL_STATES.IMPACT;
  }

  isOnTheGround() {
    return (
      this.position.y >= this.targetSlot.position.y + this.targetSlot.height
    );
  }

  handleBounces() {
    if (Math.abs(this.vy) > 1) this.vy *= -0.35;
    else {
      this.vy = 0;

      if (this.randoms[0] <= this.secondFormulaValue) {
        console.log("AVANT SHAKE");
        this.state = POKEBALL_STATES.SHAKE1;
      } else this.state = POKEBALL_STATES.ESCAPE;
    }
  }

  checkPokeballOnTheGround() {
    if (this.isOnTheGround()) {
      this.position.y = this.targetSlot.position.y + this.targetSlot.height;

      this.handleBounces();
    }
  }

  updateShake(context, { nextState, randomIndex }) {
    console.log(this.timer);

    this.draw(context);

    const angle = 0.02;
    const posX = 1;

    if (this.timer > 0) this.timer--;
    else {
      this.timer = 40;
      this.state = nextState;
      return;
    }

    if (this.timer > 30) {
      this.position.x -= posX;
      this.angle -= angle;
    } else if (this.timer <= 30 && this.timer > 10) {
      this.position.x += posX;
      this.angle += angle;
    } else {
      this.position.x -= posX;
      this.angle -= angle;
    }

    if (this.randoms[randomIndex] > this.secondFormulaValue)
      return (this.state = POKEBALL_STATES.ESCAPE);
  }

  update(context) {
    switch (this.state) {
      case POKEBALL_STATES.THROW:
        this.draw(context);

        this.position.x += this.vx;
        this.position.y += this.vy;

        this.vy += this.gravity;

        this.isCatchMod ? (this.angle = 0) : (this.angle += 0.6);

        const backSlotPosX =
          this.targetSlot.position.x + this.targetSlot.width / 2;
        let backSlotPosY = null;

        this.isCatchMod
          ? (backSlotPosY = this.targetSlot.position.y + 10)
          : (backSlotPosY =
              this.targetSlot.position.y + this.targetSlot.height / 2);

        this.checkForImpact(backSlotPosX, backSlotPosY);
        break;

      case POKEBALL_STATES.RELEASE:
        if (this.isCatchMod) {
          this.viewer.front?.update(context);
          if (
            !this.viewer.front.sprite.isPlaying &&
            this.game.battleManager.sequenceManager.pokemonDisappearsSequence
              .isFinished
          ) {
            this.viewer = null;
            this.state = POKEBALL_STATES.FALL;
          }
        }
        break;

      case POKEBALL_STATES.FALL:
        this.draw(context);

        this.position.y += this.vy;
        this.vy += this.gravity;

        this.checkPokeballOnTheGround();
        break;

      case POKEBALL_STATES.SHAKE1:
        console.log("SHAKE1");

        this.updateShake(context, {
          nextState: POKEBALL_STATES.SHAKE2,
          randomIndex: 1,
        });
        break;

      case POKEBALL_STATES.SHAKE2:
        console.log("SHAKE2");

        this.updateShake(context, {
          nextState: POKEBALL_STATES.SHAKE3,
          randomIndex: 2,
        });
        break;

      case POKEBALL_STATES.SHAKE3:
        console.log("SHAKE3");

        this.updateShake(context, {
          nextState: POKEBALL_STATES.CAPTURE,
          randomIndex: 3,
        });
        break;

      case POKEBALL_STATES.CAPTURE:
        this.draw(context);
        console.log("Le pokémon est capturé !");
        break;

      default:
        break;
    }
  }
}
