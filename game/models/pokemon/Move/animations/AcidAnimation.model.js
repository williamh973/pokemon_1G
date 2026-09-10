import { createImg } from "../../../../shareds/utils/assets/assets.utils.js";

export class AcidAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.state = "BUBBLES";

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.target) {
      this.targetViewer = this.viewers.front;
    } else {
      this.targetViewer = this.viewers.back;
    }

    this.acidBubble = createImg(
      "game/assets/images/pokemons/moves/acid/acid_bubble.png"
    );

    this.acidGoutte = createImg(
      "game/assets/images/pokemons/moves/acid/acid_goutte.png"
    );

    this.bubbles = [];
    this.gouttes = [];

    this.bubbleTimer = 0;
    this.drippingTimer = 0;

    this.isFinished = false;

    this.createBubbles();
  }

  createBubbles() {
    const startX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    const startY = this.targetViewer.sprite.position.y - 100;

    for (let i = 0; i < 3; i++) {
      this.bubbles.push({
        x: startX,
        y: startY,
        delay: i * 10,
      });
    }
  }

  updateBubbles(context) {
    this.bubbleTimer++;

    for (const bubble of this.bubbles) {
      if (this.bubbleTimer < bubble.delay) continue;

      bubble.y += 3;

      context.drawImage(this.acidBubble, bubble.x, bubble.y);
    }

    if (this.bubbleTimer >= 50) {
      this.state = "DRIPPING";
      this.createGouttes();
    }
  }

  createGouttes() {
    const targetX = this.targetViewer.sprite.position.x;
    const targetY = this.targetViewer.sprite.position.y;

    const goutteCount = 5;

    for (let i = 0; i < goutteCount; i++) {
      this.gouttes.push({
        x: targetX + Math.random() * this.targetViewer.sprite.frameWidth,

        y: targetY + Math.random() * this.targetViewer.sprite.frameHeight,

        speed: 1 + Math.random() * 1.5,
      });
    }
  }

  updateDripping(context) {
    this.drippingTimer++;

    for (const goutte of this.gouttes) {
      goutte.y += goutte.speed;

      context.drawImage(this.acidGoutte, goutte.x, goutte.y);
    }

    if (this.drippingTimer >= 60) {
      this.isFinished = true;
    }
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "BUBBLES":
        this.updateBubbles(context);
        break;

      case "DRIPPING":
        this.updateDripping(context);
        break;
    }
  }
}
