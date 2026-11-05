import { SelfDestructAnimation } from "./SelfDestructAnimation.model.js";

export class ExplosionAnimation extends SelfDestructAnimation {
  constructor(game, viewers, turnAction) {
    super(game, viewers, turnAction);

    // Explosion beaucoup plus étendue
    this.maxExplosionRadius = 190;
  }

  // --------------------------------------------------
  // SURCHARGE : détonation plus rapide
  // --------------------------------------------------

  updateOverload() {
    this.energyOpacity = 0.7 + Math.sin(this.timer * 0.65) * 0.3;

    this.updateEnergyParticles();

    if (this.timer >= 18) {
      this.nextPhase("EXPLOSION");

      this.flashOpacity = 1;
      this.explosionRadius = 15;

      this.createExplosionParticles();
      this.createShockwaves();

      if (this.game.canvas?.startShake) {
        this.game.canvas.startShake(50, 13);
      }
    }
  }

  // --------------------------------------------------
  // EXPLOSION : davantage de matière projetée
  // --------------------------------------------------

  createExplosionParticles() {
    super.createExplosionParticles();

    // Deuxième vague de flammes
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;

      this.fireParticles.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 6,
        life: 40 + Math.random() * 35,
        maxLife: 75,
        color: Math.random() > 0.5 ? "#fff4a3" : "#ff3515",
      });
    }

    // Débris supplémentaires
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 9;

      this.debris.push({
        x: this.centerX,
        y: this.centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        size: 3 + Math.random() * 6,
        life: 45 + Math.random() * 30,
      });
    }
  }

  // --------------------------------------------------
  // ONDE DE CHOC : davantage de cercles
  // --------------------------------------------------

  createShockwaves() {
    for (let i = 0; i < 7; i++) {
      this.shockwaves.push({
        radius: 5 + i * 5,
        speed: 5 + i * 1.4,
        opacity: 1 - i * 0.08,
        width: 6 - i * 0.5,
      });
    }
  }
}
