import { HYPNOSIS_ANIMATION } from "../../../../render/config/battle/pokemon/moves/hypnosisAnimation.config.js";
import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class HypnosisAnimation {
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

    this.timer = 0;
    this.duration = 45;

    this.initialBattleBackgImage =
      this.game.battleManager.battleRenderer.battleBackgroundImage;

    this.imageZ = null;

    this.changeBattleBackImage();
    this.createBeams();

    this.isFinished = false;
  }

  changeBattleBackImage() {
    this.game.battleManager.battleRenderer.setBattleBackgroundFromMoveAnimation(
      createImg(
        "game/assets/images/pokemons/moves/hypnosis/hypnosisBackground.png"
      )
    );
  }

  createBeams() {
    const beamCount = 8;

    for (let i = 0; i < beamCount; i++) {
      const viewer = new SpriteViewer(
        this.game,
        {
          ...HYPNOSIS_ANIMATION,
          loop: true,
        },
        this.targetViewer.slot
      );

      /*
       * Orientation provisoire.
       *
       * On ajustera précisément flipX / flipY
       * lorsque nous aurons le sprite hypnosisBeam.png.
       */
      viewer.sprite.flipX = this.key === "front";
      viewer.sprite.flipY = this.key === "front";

      viewer.isOpen = true;

      this.beams.push({
        viewer,

        progress: 0,

        // Chaque rayon part légèrement après le précédent.
        delay: i * 7,
      });
    }
  }

  update(context) {
    switch (this.state) {
      case "BEAM":
        this.updateBeam(context);
        break;

      case "FALLING_ASLEEP":
        this.updateFallingAsleep(context);
        break;

      default:
        break;
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

    this.state = "FALLING_ASLEEP";

    this.startAsleep();
  }

  startAsleep() {
    this.sleepTimer = 0;
    this.sleepDuration = 60;

    this.imageZ = createImg(
      "game/assets/images/pokemons/moves/hypnosis/hypnosisZ.png"
    );

    this.imageZX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.imageZY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    this.imageZInitialY = this.imageZY;
  }

  updateFallingAsleep(context) {
    this.sleepTimer++;

    this.imageZY = this.imageZInitialY--;

    context.drawImage(this.imageZ, this.imageZX, this.imageZY);

    if (this.sleepTimer >= this.sleepDuration) {
      this.onFinished();
    }
  }

  onFinished() {
    this.game.battleManager.battleRenderer.setBattleBackImg();

    this.isFinished = true;
  }
}
