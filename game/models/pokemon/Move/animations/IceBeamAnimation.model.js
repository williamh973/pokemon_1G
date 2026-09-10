import { ICE_BEAM_ANIMATION } from "../../../../render/config/battle/pokemon/moves/iceBeamAnimation.config.js";
import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class IceBeamAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.state = "BEAM";

    this.pokemon = this.turnAction.pokemon;
    this.target = this.turnAction.target;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
      this.key = "front";
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
      this.key = "back";
    }

    this.direction = this.pokemonViewer.slot.attackDirection;

    this.startX = this.pokemonViewer.sprite.position.x;
    this.endX = this.targetViewer.sprite.position.x;

    if (this.key === "front") {
      this.startX =
        this.pokemonViewer.sprite.position.x +
        this.pokemonViewer.sprite.frameWidth / 2;

      this.endX = 50;
    }

    this.startY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.endY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.beams = [];
    this.piecesIces = [];

    this.timer = 0;
    this.duration = 45;

    this.createBeams();
    this.createPiecesOfIce();

    this.isFinished = false;
  }

  createBeams() {
    const beamCount = 16;

    for (let i = 0; i < beamCount; i++) {
      const viewer = new SpriteViewer(
        this.game,
        {
          ...ICE_BEAM_ANIMATION,
          loop: true,
        },
        this.targetViewer.slot
      );

      viewer.sprite.flipX = this.key === "front";
      viewer.sprite.flipY = this.key === "front";

      viewer.isOpen = true;

      this.beams.push({
        viewer,
        progress: 0,
        delay: i * 4,
      });
    }
  }

  createPiecesOfIce() {
    const iceCount = 4;

    for (let i = 0; i < iceCount; i++) {
      const image = createImg(
        "game/assets/images/pokemons/moves/iceBeam/iceBeamHexagonShape.png"
      );

      this.piecesIces.push({
        image,

        x: 0,
        y: 0,

        delay: Math.random() * 40,

        opacity: 0,

        floatOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  updateBeam(context) {
    this.timer++;

    let finishedBeams = 0;

    for (const beam of this.beams) {
      if (this.timer < beam.delay) continue;

      const elapsed = this.timer - beam.delay;

      beam.progress = Math.min(elapsed / this.duration, 1);

      const progress = beam.progress;

      const x = this.startX + (this.endX - this.startX) * progress;

      const y = this.startY + (this.endY - this.startY) * progress;

      beam.viewer.sprite.position.x = x;
      beam.viewer.sprite.position.y = y;

      beam.viewer.update(context);

      if (progress >= 1) {
        finishedBeams++;
      }
    }

    if (finishedBeams === this.beams.length) {
      this.endBeams();
    }
  }

  endBeams() {
    for (const beam of this.beams) {
      beam.viewer.isOpen = false;
    }

    this.state = "FREEZING";

    this.startFreezing();
  }

  startFreezing() {
    this.freezeTimer = 0;
    this.freezeDuration = 120;

    const targetX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const targetY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.piecesIces.forEach((ice) => {
      const radiusX = 20 + Math.random() * 30;
      const radiusY = 20 + Math.random() * 30;

      ice.x = targetX + (Math.random() < 0.5 ? -radiusX : radiusX);

      ice.y = targetY + (Math.random() < 0.5 ? -radiusY : radiusY);

      ice.opacity = 0;
    });
  }

  updateFreeze(context) {
    this.freezeTimer++;

    for (const ice of this.piecesIces) {
      const localTimer = this.freezeTimer - ice.delay;

      if (localTimer < 0) continue;

      const cycleDuration = 60;
      const cycle = localTimer % cycleDuration;

      let opacity;

      if (cycle < 15) {
        opacity = cycle / 15;
      } else if (cycle < 40) {
        opacity = 1;
      } else {
        opacity = 1 - (cycle - 40) / 20;
      }

      ice.opacity = opacity;

      const floatX = Math.sin(this.freezeTimer * 0.08 + ice.floatOffset) * 3;

      const floatY = Math.cos(this.freezeTimer * 0.06 + ice.floatOffset) * 3;

      context.save();

      context.globalAlpha = ice.opacity;

      context.drawImage(ice.image, ice.x + floatX, ice.y + floatY);

      context.restore();
    }

    if (this.freezeTimer >= this.freezeDuration) {
      this.onFinished();
    }
  }

  onFinished() {
    this.isFinished = true;
  }

  update(context) {
    switch (this.state) {
      case "BEAM":
        this.updateBeam(context);
        break;

      case "FREEZING":
        this.updateFreeze(context);
        break;

      default:
        break;
    }
  }
}
