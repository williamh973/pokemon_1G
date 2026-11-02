import { randomBetween } from "../../../../shareds/utils/math/math.utils.js";

export class RockSlideAnimation {
  constructor(game, viewers, turnAction) {
    this.game = game;
    this.viewers = viewers;
    this.turnAction = turnAction;

    this.pokemon = turnAction.pokemon;
    this.target = turnAction.target;
    this.move = turnAction.move;

    // Viewers
    if (this.viewers.front.slot.content === this.pokemon) {
      this.pokemonViewer = this.viewers.front;
      this.targetViewer = this.viewers.back;
    } else {
      this.pokemonViewer = this.viewers.back;
      this.targetViewer = this.viewers.front;
    }

    // Animation
    this.state = "PREPARE";
    this.isFinished = false;

    // Préparation
    this.prepareTimer = 0;
    this.prepareDuration = 20;

    // Rochers
    this.rocks = [];
    this.rockCount = randomBetween(10, 15);
    this.rockInterval = randomBetween(2, 12);
    this.rockTimer = 0;
    this.rocksCreated = 0;

    this.fallArea = {
      width: 110,
      height: 80,
    };

    this.rockSpeed = randomBetween(5, 10);

    // Impacts
    this.impacts = [];
  }

  getTargetCenter() {
    const sprite = this.targetViewer.sprite;

    return {
      x: sprite.position.x + sprite.frameWidth / 2,
      y: sprite.position.y + sprite.frameHeight / 2,
    };
  }

  createRock() {
    const center = this.getTargetCenter();

    const impactX = center.x + (Math.random() - 0.5) * this.fallArea.width;

    const impactY = center.y + (Math.random() - 0.5) * this.fallArea.height;

    const startX = impactX + (Math.random() - 0.5) * 35;

    const startY = impactY - 130 - Math.random() * 60;

    const radius = 11 + Math.random() * 8;

    const vertices = [];

    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI * 2 * i) / 7;

      const vertexRadius = radius * (0.7 + Math.random() * 0.3);

      vertices.push({
        x: Math.cos(angle) * vertexRadius,
        y: Math.sin(angle) * vertexRadius,
      });
    }

    const distanceX = impactX - startX;
    const distanceY = impactY - startY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const speed = this.rockSpeed + Math.random() * 2;

    this.rocks.push({
      x: startX,
      y: startY,

      velocityX: (distanceX / distance) * speed,
      velocityY: (distanceY / distance) * speed,

      impactX,
      impactY,

      radius,
      vertices,

      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,

      isFinished: false,
    });

    this.rocksCreated++;
  }

  updateRockCreation() {
    if (this.rocksCreated >= this.rockCount) return;

    this.rockTimer++;

    if (this.rockTimer >= this.rockInterval) {
      this.rockTimer = 0;
      this.createRock();
    }
  }

  updateRocks(context) {
    this.rocks.forEach((rock) => {
      rock.x += rock.velocityX;
      rock.y += rock.velocityY;

      rock.rotation += rock.rotationSpeed;

      this.drawRock(context, rock);

      const distanceX = rock.impactX - rock.x;
      const distanceY = rock.impactY - rock.y;

      if (
        Math.sqrt(distanceX * distanceX + distanceY * distanceY) <=
        this.rockSpeed + 2
      ) {
        this.createImpact(rock.impactX, rock.impactY);
        rock.isFinished = true;

        // Secousse lors du dernier impact
        if (this.rocksCreated === this.rockCount && this.rocks.length === 1) {
          this.game.canvas.startShake(400, 5);
        }
      }
    });

    this.rocks = this.rocks.filter((rock) => !rock.isFinished);
  }

  drawRock(context, rock) {
    context.save();

    context.translate(rock.x, rock.y);
    context.rotate(rock.rotation);

    // Corps du rocher
    context.beginPath();

    rock.vertices.forEach((vertex, index) => {
      if (index === 0) context.moveTo(vertex.x, vertex.y);
      else context.lineTo(vertex.x, vertex.y);
    });

    context.closePath();

    context.fillStyle = "#777777";
    context.fill();

    context.strokeStyle = "#454545";
    context.lineWidth = 2;
    context.stroke();

    // Relief intérieur
    context.beginPath();

    context.moveTo(-rock.radius * 0.5, -rock.radius * 0.2);
    context.lineTo(0, -rock.radius * 0.65);
    context.lineTo(rock.radius * 0.45, -rock.radius * 0.2);

    context.closePath();

    context.fillStyle = "#AAAAAA";
    context.fill();

    context.restore();
  }

  createImpact(x, y) {
    const fragments = [];

    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI * 2 * i) / 7;
      const speed = 1 + Math.random() * 2;

      fragments.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
      });
    }

    this.impacts.push({
      x,
      y,
      timer: 0,
      duration: 20,
      fragments,
    });
  }

  updateImpacts(context) {
    this.impacts.forEach((impact) => {
      impact.timer++;

      const opacity = 1 - impact.timer / impact.duration;

      impact.fragments.forEach((fragment) => {
        fragment.x += fragment.velocityX;
        fragment.y += fragment.velocityY;

        fragment.velocityY += 0.12;

        this.drawFragment(context, fragment, opacity);
      });

      this.drawDust(context, impact, opacity);
    });

    this.impacts = this.impacts.filter(
      (impact) => impact.timer < impact.duration
    );
  }

  drawFragment(context, fragment, opacity) {
    context.save();

    context.globalAlpha = opacity;
    context.fillStyle = "#777777";

    context.beginPath();
    context.arc(fragment.x, fragment.y, fragment.radius, 0, Math.PI * 2);

    context.fill();
    context.restore();
  }

  drawDust(context, impact, opacity) {
    const radius = impact.timer * 0.5;

    context.save();

    context.globalAlpha = opacity * 0.35;
    context.fillStyle = "#999999";

    context.beginPath();
    context.arc(impact.x, impact.y, radius, 0, Math.PI * 2);

    context.fill();
    context.restore();
  }

  update(context) {
    if (this.isFinished) return;

    switch (this.state) {
      case "PREPARE":
        this.prepareTimer++;

        if (this.prepareTimer >= this.prepareDuration) {
          this.state = "FALL";
        }
        break;

      case "FALL":
        this.updateRockCreation();
        this.updateRocks(context);
        this.updateImpacts(context);

        if (this.rocksCreated >= this.rockCount && this.rocks.length === 0) {
          this.state = "FINISH";
        }
        break;

      case "FINISH":
        this.updateImpacts(context);

        if (this.impacts.length === 0) {
          this.isFinished = true;
        }
        break;
    }
  }
}
