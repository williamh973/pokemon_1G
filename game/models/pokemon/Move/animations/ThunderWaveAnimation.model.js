import { THUNDER_WAVE_ANIMATION } from "../../../../render/config/battle/pokemon/moves/thunderWaveAnimation.config.js";
import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class ThunderWaveAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.state = "VERTICAL_WAVE";

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.target) {
      this.targetViewer = this.viewers.front;
      this.key = "front";
    } else {
      this.targetViewer = this.viewers.back;
      this.key = "back";
    }

    this.orizontalThunder = createImg(
      "game/assets/images/pokemons/moves/thunderWave/orizontalThunder.png"
    );

    this.orizontalThunders = [];

    this.viewer = new SpriteViewer(
      this.game,
      {
        ...THUNDER_WAVE_ANIMATION,
        loop: true,
      },
      this.targetViewer.slot
    );

    this.viewer.sprite.position.x = this.targetViewer.sprite.position.x;

    this.viewer.sprite.position.y = this.targetViewer.sprite.position.y;

    this.viewer.isOpen = true;

    this.horizontalTimer = 0;
    this.horizontalDuration = 60;

    this.finalTimer = 0;
    this.finalDuration = 60;

    this.isFinished = false;

    this.verticalThunder = {
      image: createImg(
        "game/assets/images/pokemons/moves/thunderWave/verticalThunder.png"
      ),
      x:
        this.targetViewer.sprite.position.x +
        this.targetViewer.sprite.frameWidth / 2,
      y: this.targetViewer.sprite.position.y - 100,
    };
  }

  updateVerticalWave(context) {
    this.verticalThunder.y += 2;

    context.drawImage(
      this.verticalThunder.image,
      this.verticalThunder.x,
      this.verticalThunder.y
    );

    const ground =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight;

    if (this.verticalThunder.y >= ground) {
      this.state = "ORIZONTAL_WAVE";
      this.createOrizontalThunders();
    }
  }

  createOrizontalThunders() {
    const thunderCount = 3;

    const targetX = this.targetViewer.sprite.position.x;
    const targetY = this.targetViewer.sprite.position.y;

    for (let i = 0; i < thunderCount; i++) {
      this.orizontalThunders.push({
        x: targetX,
        y: targetY + Math.random() * this.targetViewer.sprite.frameHeight,
      });
    }
  }

  updateOrizontalWave(context) {
    this.horizontalTimer++;

    for (const thunder of this.orizontalThunders) {
      context.drawImage(this.orizontalThunder, thunder.x, thunder.y);
    }

    if (this.horizontalTimer >= this.horizontalDuration) {
      this.state = "FINAL_WAVE";
      this.viewer.sprite.isPlaying = true;
    }
  }

  updateFinalWave(context) {
    this.finalTimer++;

    this.viewer.update(context);

    if (this.finalTimer >= this.finalDuration) {
      this.viewer.isOpen = false;
      this.isFinished = true;
    }
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "VERTICAL_WAVE":
        this.updateVerticalWave(context);
        break;

      case "ORIZONTAL_WAVE":
        this.updateOrizontalWave(context);
        break;

      case "FINAL_WAVE":
        this.updateFinalWave(context);
        break;

      default:
        break;
    }
  }
}
