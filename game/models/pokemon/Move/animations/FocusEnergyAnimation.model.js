import { FOCUS_ENERGY_ANIMATION } from "../../../../render/config/battle/pokemon/moves/focusEnergyAnimation.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class FocusEnergyAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    this.state = "TARGET_SHAKE";

    if (this.viewers.front.slot.content === this.pokemon) {
      this.targetViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.targetViewer = this.viewers.back;
      this.key = "back";
    }

    this.animations = [];

    this.energies = [
      { x: -55, y: -30, delay: 100 },
      { x: -30, y: 20, delay: 100 },
      { x: 0, y: 30, delay: 100 },
      { x: 20, y: 10, delay: 100 },
      { x: 35, y: -30, delay: 100 },
    ];

    this.animationTime = 100;
    this.elapsedTime = 0;
    this.energyIndex = 0;

    this.targetInitialPositionY = this.targetViewer.sprite.position.y;

    this.shakeDistance = 10;
    this.shakeSpeed = 2;

    this.shakeCount = 0;
    this.maxShakeCount = 5;

    this.direction = 1;

    this.isFinished = false;
  }

  createEnergy(energy) {
    const viewer = new SpriteViewer(
      this.game,
      FOCUS_ENERGY_ANIMATION,
      this.targetViewer.slot
    );

    const centerX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const centerY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    viewer.sprite.position.x = centerX + energy.x;
    viewer.sprite.position.y = centerY + energy.y;

    viewer.isOpen = true;

    this.animations.push(viewer);
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "TARGET_SHAKE":
        const sprite = this.targetViewer.sprite;

        sprite.position.y += this.shakeSpeed * this.direction;

        if (
          Math.abs(sprite.position.y - this.targetInitialPositionY) >=
          this.shakeDistance
        ) {
          this.direction *= -1;
          this.shakeCount++;
        }

        if (this.shakeCount >= this.maxShakeCount) {
          sprite.position.y = this.targetInitialPositionY;

          this.state = "ENERGIES";
        }
        break;
      case "ENERGIES":
        this.elapsedTime += this.animationTime;

        if (
          this.elapsedTime >= this.animationTime &&
          this.energyIndex < this.energies.length
        ) {
          this.elapsedTime = 0;

          this.createEnergy(this.energies[this.energyIndex]);

          this.energyIndex++;
        }

        for (const animation of this.animations) {
          animation.update(context);
          animation.sprite.position.y -= 1;
          if (!animation.sprite.isPlaying) {
            animation.isOpen = false;
          }
        }

        this.animations = this.animations.filter(
          (animation) => animation.isOpen
        );

        if (
          this.energyIndex >= this.energies.length &&
          this.animations.length === 0
        ) {
          this.isFinished = true;
        }
        break;

      default:
        break;
    }
  }
}
