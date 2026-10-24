export class FlyAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;
    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    if (this.viewers.front.slot.content === this.pokemon) {
      this.key = "front";
      this.pokemonSlot = this.viewers.front.slot;
    } else {
      this.key = "back";
      this.pokemonSlot = this.viewers.back.slot;
    }

    this.sprite = this.viewers[this.key].sprite;
    this.initialX = this.sprite.position.x;
    this.initialY = this.sprite.position.y;

    this.direction = this.pokemonSlot.attackDirection;

    this.attackDistance = 50;
    this.flightHeight = 265;
    this.speed = 8;

    this.phase = this.turnAction.pokemon.chargedMove.animationPhase;
    console.log(this.phase); // FIRST arrive correctement ici, l'animation tackeOff est executé
    this.isFinished = false;

    this.targetX = this.initialX + this.attackDistance * this.direction;
    this.targetY = this.initialY;

    this.frame = 0;
    this.maxHoverFrames = 20;
  }

  update() {
    if (this.isFinished) return;

    switch (this.phase) {
      case "FIRST":
        this.takeOff();
        break;

      case "SECOND":
        this.dive();
        break;

      case "RETURN":
        this.returnToPosition();
        break;
    }
  }

  takeOff() {
    this.sprite.position.y -= this.speed;

    if (this.sprite.position.y <= this.initialY - this.flightHeight) {
      this.sprite.position.y = this.initialY - this.flightHeight;
      this.frame = 0;
    }
  }

  hover() {
    this.frame++;

    if (this.frame >= this.maxHoverFrames) {
      this.phase = "DIVE";
    }
  }

  dive() {
    this.sprite.position.x += this.speed * this.direction;
    this.sprite.position.y += this.speed * 1.5;

    const reachedTargetX =
      this.direction > 0
        ? this.sprite.position.x >= this.targetX
        : this.sprite.position.x <= this.targetX;

    if (reachedTargetX) {
      this.sprite.position.x = this.targetX;
      this.sprite.position.y = this.targetY;
      this.phase = "RETURN";
    }
  }

  returnToPosition() {
    const dx = this.initialX - this.sprite.position.x;
    const dy = this.initialY - this.sprite.position.y;

    const distance = Math.hypot(dx, dy);

    if (distance <= this.speed) {
      this.sprite.position.x = this.initialX;
      this.sprite.position.y = this.initialY;
      this.isFinished = true;
      return;
    }

    this.sprite.position.x += (dx / distance) * this.speed;
    this.sprite.position.y += (dy / distance) * this.speed;
  }
}
