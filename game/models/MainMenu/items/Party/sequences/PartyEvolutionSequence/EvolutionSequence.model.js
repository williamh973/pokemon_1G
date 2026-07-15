import { evolutionBackgImg } from "../../../../../../assets/images/ui/ui.asset.js";
import {
  calculateStats,
  generatePokemon,
} from "../../../../../../logic/gameplay/encounters/generatePokemon.gameplay.js";
import { INPUT_STATE } from "../../../../../../logic/input/inputs.state.js";
import { SPECIES_DATABASE } from "../../../../../../shareds/pokemon/species/species.database.js";
import { getAnimationConfig } from "../../../../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { getSpeciesData } from "../../../../../../shareds/utils/pokemon/species/species.utils.js";
import { Slot } from "../../../../../Slot/Slot.model.js";
import { SpriteViewer } from "../../../../../SpriteViewer/SpriteViewer.model.js";

export class EvolutionSequence {
  constructor(game, pokemon) {
    this.game = game;
    this.pokemon = pokemon;
    this.width = game.canvas.width;
    this.height = game.canvas.height;

    this.position = {
      x: 0,
      y: 0,
    };

    this.isOpen = false;
    this.hasStarted = false;
    this.hasStopped = false;
    this.phase = null;

    this.viewer = {
      old: null,
      evolved: null,
    };

    this.slot = new Slot({
      positionX: 112,
      positionY: 100,
      width: 100,
      height: 100,
    });

    this.backgImg = evolutionBackgImg;
    this.phaseTimer = 0;
    this.beforeStartTimer = 120;
    this.energy = 0;
    this.radius = 0;
    this.flash = 0;
    this.angle = 0;
    this.scale = 1;
    this.offsetY = 0;
    this.particles = [];
    this.evolvedFormSpecies = this.getEvolvedForm();

    console.log(this.pokemon);
  }

  getEvolvedForm() {
    const evolution = SPECIES_DATABASE[this.pokemon.id].evolutions[0];

    return SPECIES_DATABASE[evolution.target];
  }

  open() {
    this.isOpen = true;
    this.showPokemonNeedsEvolve();
  }

  close() {
    this.isOpen = false;
  }

  start() {
    this.hasStarted = true;
    this.phase = "INTRO";
  }

  showPokemonNeedsEvolve() {
    this.viewer.old = new SpriteViewer(
      this.game,
      getAnimationConfig(this.pokemon.id, "front"),
      this.slot
    );

    this.viewer.old.isOpen = true;
  }

  showPokemonEvolvedForm() {
    this.viewer.evolved = new SpriteViewer(
      this.game,
      getAnimationConfig(this.evolvedFormSpecies.id, "front"),
      this.slot
    );

    this.viewer.evolved.isOpen = true;
  }

  draw(context) {
    context.drawImage(
      this.backgImg,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  introAnimation(context) {
    this.energy += 0.5;

    if (this.energy > 70)
      this.drawEnergyCircle(context, Math.floor(Math.random() * 5 + 40));
    else this.drawEnergyCircle(context, this.energy * 20);

    if (this.energy >= 150) this.phase = "CHARGE";
  }

  energyCharge(context) {
    console.log("CHARGE");
    this.radius += 10;

    if (this.radius <= 200) this.drawEnergyCircle(context, this.radius * 3);
    else this.radius = 0;

    this.createParticles();
    this.drawParticles(context);

    if (this.particles.length >= 150) this.phase = "ASCENSION";
  }

  ascension(context) {
    console.log("ASCENSION");
    this.offsetY = Math.sin(Date.now() / 200) * 5;

    this.radius += 4;
    if (this.radius > 300) this.phase = "ABSORB";
  }

  absorb(context) {
    console.log("ABSORB");

    this.drawParticles(context);

    if (this.particles.length > 40) {
      this.phase = "CORE";
      this.particles = [];
      this.energy = 0;
    }
  }

  core(context) {
    console.log("CORE");
    this.flash += 0.2;

    context.beginPath();

    context.fillStyle = `rgba(255,255,255,0.7)`;

    context.arc(
      this.width / 2,
      this.height / 2,
      this.flash * 30,
      0,
      Math.PI * 2
    );

    context.fill();

    if (this.flash >= 10) this.viewer.old.isOpen = false;

    if (this.flash >= 13) {
      this.showPokemonEvolvedForm();

      this.phase = "REVEAL";

      this.flash = 0;
    }
  }

  reveal(context) {
    console.log("REVEAL");
    this.energy += 0.04;

    const alpha = Math.max(0, 1 - this.energy);

    context.fillStyle = `rgba(255,255,255,${alpha})`;

    context.fillRect(0, 0, this.width, this.height);

    if (this.energy >= 5) this.phase = "CELEBRATION";
  }

  celebration(context) {
    console.log("CELEBRATION");
    const pokemonNeedsEvolveName = this.pokemon.name;

    this.updatePokemonNeedsEvolve();

    this.game.dialogBox.open(
      `Félicitation! ${pokemonNeedsEvolveName} a \névolué en ${this.pokemon.name}!`
    );

    this.phase = "END";
    console.log(this.pokemon);
  }

  end(action) {
    if (action === INPUT_STATE.ACTION) this.quitSequence();
  }

  updatePokemonNeedsEvolve() {
    const evolvedPokemon = this.evolvedFormSpecies;

    this.pokemon.id = evolvedPokemon.id;
    this.pokemon.name = evolvedPokemon.name;
    this.pokemon.stats = calculateStats(
      getSpeciesData(evolvedPokemon.id).baseStats,
      this.pokemon.ivs,
      this.pokemon.evs,
      this.pokemon.level
    );
    this.pokemon.stats = {
      ...this.pokemon.stats,
      maxHp: this.pokemon.stats.hp,
    };
  }

  createParticles() {
    if (Math.random() < 0.8) {
      const angle = Math.random() * Math.PI * 2;

      const distance = 180 + Math.random() * 120;

      this.particles.push({
        x: this.width / 2 + Math.cos(angle) * distance,

        y: this.height / 2 + Math.sin(angle) * distance,

        targetX: this.width / 2,
        targetY: this.height / 2,

        radius: Math.random() * 3 + 1,

        speed: Math.random() * 0.5 + 0.5,

        alpha: 1,

        angle,
      });
    }
  }

  drawParticles(context) {
    this.particles.forEach((p) => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      p.x += (dx / distance) * p.speed * 4;
      p.y += (dy / distance) * p.speed * 4;

      p.alpha -= 0.005;

      context.beginPath();

      context.fillStyle = `rgba(255,255,255,${p.alpha})`;

      context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      context.fill();
    });

    this.particles = this.particles.filter((p) => p.alpha > 0);
  }

  drawEnergyCircle(context, radius) {
    context.save();

    context.translate(this.width / 2, this.height / 2);

    context.strokeStyle = `rgba(255,255,255,0.2)`;

    context.lineWidth = 1;

    context.beginPath();

    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255, 0.1)`;
    context.fill();
    context.stroke();

    context.restore();
  }

  quitSequence() {
    if (this.game.dialogBox.isOpen) this.game.dialogBox.close();
    this.game.closeEvolution();
    this.game.openParty();
  }

  update(context, action) {
    if (!this.isOpen) return;

    this.phaseTimer++;

    this.draw(context);
    this.viewer.old?.update(context);

    this.viewer.evolved?.update(context);

    this.game.dialogBox?.update(context, action);

    if (!this.hasStarted) {
      this.beforeStartTimer--;

      if (action === INPUT_STATE.ESCAPE && !this.hasStopped)
        this.hasStopped = true;

      if (this.hasStopped) this.quitSequence();

      if (this.beforeStartTimer <= 0) this.start();
    }

    switch (this.phase) {
      case "INTRO":
        this.introAnimation(context);
        break;

      case "CHARGE":
        this.energyCharge(context);
        break;

      case "ASCENSION":
        this.ascension(context);
        break;

      case "ABSORB":
        this.absorb(context);
        break;

      case "CORE":
        this.core(context);
        break;

      case "REVEAL":
        this.reveal(context);
        break;

      case "CELEBRATION":
        this.celebration(context);
        break;

      case "END":
        this.end(action);
        break;
    }
  }
}
