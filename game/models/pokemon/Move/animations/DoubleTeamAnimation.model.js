export class DoubleTeamAnimation {
  static PHASES = {
    PREPARE: "PREPARE",
    DUPLICATE: "DUPLICATE",
    SHIFT: "SHIFT",
    DISSIPATE: "DISSIPATE",
    FINISH: "FINISH",
  };

  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    if (viewers.front.slot.content === turnAction.pokemon) {
      this.pokemonViewer = viewers.front;
      this.targetViewer = viewers.back;
    } else {
      this.pokemonViewer = viewers.back;
      this.targetViewer = viewers.front;
    }

    this.sprite = this.pokemonViewer.sprite;

    this.phase = DoubleTeamAnimation.PHASES.PREPARE;
    this.timer = 0;
    this.isFinished = false;

    this.originalX = this.sprite.position.x;
    this.originalY = this.sprite.position.y;

    this.width = this.sprite.frameWidth * this.sprite.scale;
    this.height = this.sprite.frameHeight * this.sprite.scale;

    this.clones = [];

    this.phaseDuration = {
      PREPARE: 8,
      DUPLICATE: 18,
      SHIFT: 48,
      DISSIPATE: 24,
      FINISH: 8,
    };

    this.maxOffset = Math.max(12, this.width * 0.55);
  }

  update(context) {
    if (this.isFinished) return;

    this.timer++;

    switch (this.phase) {
      case DoubleTeamAnimation.PHASES.PREPARE:
        this.updatePrepare();
        break;

      case DoubleTeamAnimation.PHASES.DUPLICATE:
        this.updateDuplicate();
        break;

      case DoubleTeamAnimation.PHASES.SHIFT:
        this.updateShift();
        break;

      case DoubleTeamAnimation.PHASES.DISSIPATE:
        this.updateDissipate();
        break;

      case DoubleTeamAnimation.PHASES.FINISH:
        this.updateFinish();
        break;
    }

    this.draw(context);
  }

  changePhase(phase) {
    this.phase = phase;
    this.timer = 0;
  }

  easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  updatePrepare() {
    if (this.timer >= this.phaseDuration.PREPARE) {
      this.changePhase(DoubleTeamAnimation.PHASES.DUPLICATE);
    }
  }

  updateDuplicate() {
    const progress = Math.min(1, this.timer / this.phaseDuration.DUPLICATE);

    const distance = this.maxOffset * this.easeInOut(progress);

    this.clones = [
      { offsetX: -distance, offsetY: 0, alpha: 0.5 },
      { offsetX: distance, offsetY: 0, alpha: 0.5 },
      { offsetX: -distance * 0.5, offsetY: -7, alpha: 0.3 },
      { offsetX: distance * 0.5, offsetY: 7, alpha: 0.3 },
    ];

    if (this.timer >= this.phaseDuration.DUPLICATE) {
      this.changePhase(DoubleTeamAnimation.PHASES.SHIFT);
    }
  }

  updateShift() {
    const progress = this.timer / this.phaseDuration.SHIFT;

    this.clones.forEach((clone, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const phaseOffset = (index * Math.PI) / 2;

      clone.offsetX =
        direction *
        (this.maxOffset + Math.sin(progress * Math.PI * 6 + phaseOffset) * 8);

      clone.offsetY = Math.cos(progress * Math.PI * 6 + phaseOffset) * 5;

      clone.alpha = index < 2 ? 0.5 : 0.3;
    });

    if (this.timer >= this.phaseDuration.SHIFT) {
      this.changePhase(DoubleTeamAnimation.PHASES.DISSIPATE);
    }
  }

  updateDissipate() {
    const progress = Math.min(1, this.timer / this.phaseDuration.DISSIPATE);

    const fade = 1 - this.easeInOut(progress);

    this.clones.forEach((clone) => {
      clone.alpha *= fade;
      clone.offsetX *= 1.02;
    });

    if (this.timer >= this.phaseDuration.DISSIPATE) {
      this.clones = [];
      this.changePhase(DoubleTeamAnimation.PHASES.FINISH);
    }
  }

  updateFinish() {
    if (this.timer >= this.phaseDuration.FINISH) {
      this.isFinished = true;
    }
  }

  drawClone(context, clone) {
    const frame = this.sprite.currentFrame;

    context.save();

    context.globalAlpha = clone.alpha;

    // Teinte lumineuse des images rémanentes.
    context.filter = "brightness(1.7) saturate(0.35)";

    context.drawImage(
      this.sprite.image,
      frame * this.sprite.frameWidth,
      0,
      this.sprite.frameWidth,
      this.sprite.frameHeight,
      this.originalX + clone.offsetX,
      this.originalY + clone.offsetY,
      this.width,
      this.height
    );

    context.restore();
  }

  draw(context) {
    context.save();

    // Dessiner les silhouettes secondaires.
    this.clones.forEach((clone) => {
      if (clone.alpha > 0.01) {
        this.drawClone(context, clone);
      }
    });

    // Ne pas redessiner le Pokémon original :
    // son AnimatedSprite est déjà rendu par SpriteViewer.

    context.restore();
  }
}
