export class ScreechAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // --------------------------------------------------
    // VIEWERS
    // --------------------------------------------------

    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
      this.key = "front";
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
      this.key = "back";
    }

    // --------------------------------------------------
    // POSITIONS
    // --------------------------------------------------

    this.initialPositionX = this.pokemonViewer.sprite.position.x;

    this.pokemonCenterX =
      this.pokemonViewer.sprite.position.x +
      this.pokemonViewer.sprite.frameWidth / 2;

    this.pokemonCenterY =
      this.pokemonViewer.sprite.position.y +
      this.pokemonViewer.sprite.frameHeight / 2;

    this.targetCenterX =
      this.targetViewer.sprite.position.x +
      this.targetViewer.sprite.frameWidth / 2;

    this.targetCenterY =
      this.targetViewer.sprite.position.y +
      this.targetViewer.sprite.frameHeight / 2;

    // --------------------------------------------------
    // STATE
    // --------------------------------------------------

    this.state = "RECOIL";

    // --------------------------------------------------
    // LANCEUR
    // --------------------------------------------------

    this.animationIndex = 0;

    this.animations = [
      { distance: -5, speed: 2 },
      { distance: 10, speed: 3 },
      { distance: -7, speed: 3 },
      { distance: 13, speed: 4 },
      { distance: -8, speed: 3 },
      { distance: 16, speed: 5 },
      { distance: 0, speed: 4 },
    ];

    this.currentStartX = this.initialPositionX;
    this.currentTargetX = this.initialPositionX;
    this.direction = 1;

    // --------------------------------------------------
    // ONDE
    // --------------------------------------------------

    this.waveX = this.pokemonCenterX;
    this.waveY = this.pokemonCenterY;

    this.waveSpeed = 5;

    this.waveStartX = this.pokemonCenterX;
    this.waveTargetX = this.targetCenterX;

    this.waveStartY = this.pokemonCenterY;
    this.waveTargetY = this.targetCenterY;

    // --------------------------------------------------
    // CIBLE
    // --------------------------------------------------

    this.targetInitialPositionX = this.targetViewer.sprite.position.x;

    this.shakeDistance = 4;
    this.shakeSpeed = 2;
    this.shakeCount = 0;
    this.maxShakeCount = 6;
    this.shakeDirection = 1;

    // --------------------------------------------------
    // FIN
    // --------------------------------------------------

    this.isFinished = false;

    this.startAnimation();
  }

  // --------------------------------------------------
  // LANCEUR
  // --------------------------------------------------

  startAnimation() {
    const animation = this.animations[this.animationIndex];

    this.currentStartX = this.pokemonViewer.sprite.position.x;

    this.currentTargetX = this.initialPositionX + animation.distance;

    this.direction = this.currentTargetX >= this.currentStartX ? 1 : -1;
  }

  updatePokemonMovement() {
    const sprite = this.pokemonViewer.sprite;
    const animation = this.animations[this.animationIndex];

    const distanceRemaining = Math.abs(this.currentTargetX - sprite.position.x);

    if (distanceRemaining > 0) {
      const movement = Math.min(animation.speed, distanceRemaining);

      sprite.position.x += movement * this.direction;

      return;
    }

    sprite.position.x = this.currentTargetX;

    this.animationIndex++;

    if (this.animationIndex >= this.animations.length) {
      sprite.position.x = this.initialPositionX;

      // Le lanceur a terminé son mouvement :
      // on lance maintenant l'onde.
      this.state = "WAVE";

      return;
    }

    this.startAnimation();
  }

  // --------------------------------------------------
  // ONDE
  // --------------------------------------------------

  updateWave() {
    const deltaX = this.waveTargetX - this.waveX;
    const deltaY = this.waveTargetY - this.waveY;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance > 0) {
      const movement = Math.min(this.waveSpeed, distance);
      this.waveX += (deltaX / distance) * movement;
      this.waveY += (deltaY / distance) * movement;
      return;
    }
    this.waveX = this.waveTargetX;
    this.waveY = this.waveTargetY;
    this.state = "TARGET_SHAKE";
  }
  // --------------------------------------------------
  // CIBLE
  // --------------------------------------------------

  updateTargetShake() {
    const sprite = this.targetViewer.sprite;

    sprite.position.x += this.shakeSpeed * this.shakeDirection;

    if (
      Math.abs(sprite.position.x - this.targetInitialPositionX) >=
      this.shakeDistance
    ) {
      this.shakeDirection *= -1;
      this.shakeCount++;
    }

    if (this.shakeCount >= this.maxShakeCount) {
      sprite.position.x = this.targetInitialPositionX;
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // RENDU DE L'ONDE
  // --------------------------------------------------

  drawWave(context) {
    const ctx = context;

    ctx.save();

    ctx.beginPath();

    // Plusieurs arcs donnent une impression d'onde sonore.
    for (let i = 0; i < 3; i++) {
      const offset = i * 5;

      ctx.arc(
        this.waveX + offset,
        this.waveY,
        8 + i * 3,
        -Math.PI / 2,
        Math.PI / 2
      );
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.restore();
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "RECOIL":
        this.updatePokemonMovement();
        break;

      case "WAVE":
        this.updateWave();
        this.drawWave(context);
        break;

      case "TARGET_SHAKE":
        this.updateTargetShake();
        break;

      default:
        break;
    }
  }
}
