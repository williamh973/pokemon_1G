import { GUST_ANIMATION } from "../../../../render/config/battle/pokemon/moves/gustAnimation.config.js";
import { SpriteViewer } from "../../../SpriteViewer/SpriteViewer.model.js";

export class GustAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

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

    this.viewer = new SpriteViewer(
      this.game,
      GUST_ANIMATION,
      this.targetViewer.slot
    );

    const targetSprite = this.targetViewer.sprite;

    // Centre de l'orbite
    this.centerX = targetSprite.position.x;
    this.centerY = targetSprite.position.y;

    // Taille de l'orbite
    this.radiusX = 50;
    this.radiusY = 15;

    // Progression angulaire
    this.angle = Math.PI;

    // Vitesse de rotation
    this.speed = 0.08;

    this.viewer.isOpen = true;

    this.isFinished = false;
  }

  update(context) {
    if (this.isFinished) return;

    /*
     * Orbite elliptique :
     *
     * x = centre + cos(angle) * rayonX
     * y = centre + sin(angle) * rayonY
     */
    this.viewer.sprite.position.x =
      this.centerX + Math.cos(this.angle) * this.radiusX;

    this.viewer.sprite.position.y =
      this.centerY + Math.sin(this.angle) * this.radiusY;

    this.viewer.update(context);

    /*
     * La tornade continue son orbite.
     */
    this.angle += this.speed;

    /*
     * Une révolution complète est effectuée.
     */
    if (this.angle >= Math.PI * 3.5) {
      this.viewer.isOpen = false;
      this.isFinished = true;
    }
  }
}
