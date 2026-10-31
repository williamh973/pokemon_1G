export class SkullBashAnimation {
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
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;
    this.targetSprite = this.targetViewer.sprite;

    this.phase = this.pokemon.chargedMove.animationPhase;

    if (this.phase === "FIRST") {
      this.pokemon.chargedMove.initialPosition = {
        x: this.sprite.position.x,
        y: this.sprite.position.y,
      };
    }

    const initialPosition = this.pokemon.chargedMove.initialPosition;

    if (!initialPosition) {
      throw new Error(
        `[SKULL BASH] Position initiale introuvable pour ${this.pokemon.name}`
      );
    }

    this.initialX = initialPosition.x;
    this.initialY = initialPosition.y;

    this.isFinished = false;

    this.backDistance = 265;
    this.backSpeed = 8;

    this.chargeDuration = 18;
    this.returnDuration = 12;

    this.frame = 0;

    // --------------------------------------------------
    // POSITION DE LA CIBLE
    // --------------------------------------------------

    this.targetCenterX =
      this.targetSprite.position.x + this.targetSprite.frameWidth / 2;

    this.targetCenterY =
      this.targetSprite.position.y + this.targetSprite.frameHeight / 2;

    // Le lanceur vise le centre de la cible.
    // Le décalage de 40 px peut être ajusté selon tes sprites.
    this.targetX = this.targetCenterX - this.sprite.frameWidth / 2;
    this.targetY = this.targetCenterY - this.sprite.frameHeight / 2;

    // --------------------------------------------------
    // INITIALISATION DES POSITIONS
    // --------------------------------------------------

    this.initializeFlyPositions();

    // --------------------------------------------------
    // TRAJECTOIRE
    // --------------------------------------------------

    this.diveStartX = this.initialX - this.backDistance;
    this.diveStartY = this.initialY;

    this.diveEndX = this.attackX;
    this.diveEndY = this.attackY;

    this.diveFromX = this.diveStartX;
    this.diveFromY = this.diveStartY;

    this.diveToX = this.diveEndX;
    this.diveToY = this.diveEndY;

    // --------------------------------------------------
    // DÉPART DE LA PHASE SECOND
    // --------------------------------------------------

    if (this.phase === "SECOND") {
      this.startChargeFromSide();
    }
  }

  initializeFlyPositions() {
    const canvas = this.game.canvas;

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    // Position au sol à conserver entre les deux phases.
    this.groundX = this.initialX;
    this.groundY = this.initialY;

    // Le sprite doit être entièrement à côté du canvas.
    this.offscreenX = -this.sprite.frameWidth - 100;

    // Le côté d'apparition dépend du côté où se trouve le lanceur.
    // Si le lanceur est à gauche, il entre depuis la gauche.
    // S'il est à droite, il entre depuis la droite.
    const isOnLeft = this.initialX < this.canvasWidth / 2;

    this.entryX = isOnLeft ? -this.sprite.frameWidth - 5 : this.canvasWidth + 5;

    // Point d'attaque : proche du centre de la cible.
    this.entryY = Math.max(0, this.targetSprite.position.y - 20);

    this.attackX =
      this.targetSprite.position.x +
      this.targetSprite.frameWidth / 2 -
      this.sprite.frameWidth / 2;

    this.attackY =
      this.targetSprite.position.y +
      this.targetSprite.frameHeight / 2 -
      this.sprite.frameHeight / 2;
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update() {
    if (this.isFinished) return;

    switch (this.phase) {
      case "FIRST":
        this.prepareCharge();
        break;

      case "SECOND":
        this.charge();
        break;

      case "RETURN":
        this.returnToPosition();
        break;
    }
  }

  prepareCharge() {
    this.sprite.position.x -= this.backSpeed;

    // Sortie complète par le coté.
    if (this.sprite.position.x + this.sprite.frameWidth <= 0) {
      this.sprite.position.x = this.offscreenX;
      this.isFinished = true;
    }
  }

  // --------------------------------------------------
  // CHARGE
  // --------------------------------------------------

  startChargeFromSide() {
    // Position de départ de la phase 2.
    this.sprite.position.x = this.entryX;
    this.sprite.position.y = this.entryY;

    this.chargeFromX = this.entryX;
    this.chargeFromY = this.entryY;

    this.chargeToX = this.attackX;
    this.chargeToY = this.attackY;

    this.frame = 0;
    this.phase = "SECOND";
  }

  charge() {
    this.frame++;

    const duration = this.chargeDuration;
    const progress = Math.min(this.frame / duration, 1);

    // Accélération progressive.
    const eased = progress * progress;

    this.sprite.position.x =
      this.chargeFromX + (this.chargeToX - this.chargeFromX) * eased;

    this.sprite.position.y =
      this.chargeFromY + (this.chargeToY - this.chargeFromY) * eased;

    if (progress >= 1) {
      this.sprite.position.x = this.chargeToX;
      this.sprite.position.y = this.chargeToY;

      this.frame = 0;
      this.phase = "RETURN";
    }
  }

  // --------------------------------------------------
  // RETOUR
  // --------------------------------------------------

  returnToPosition() {
    this.frame++;

    const progress = Math.min(this.frame / this.returnDuration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    this.sprite.position.x =
      this.chargeToX + (this.groundX - this.chargeToX) * eased;

    this.sprite.position.y =
      this.chargeToY + (this.groundY - this.diveToY) * eased;

    if (progress >= 1) {
      this.sprite.position.x = this.groundX;
      this.sprite.position.y = this.groundY;
      this.isFinished = true;
    }
  }
}
