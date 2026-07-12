import { evolutionBackgImg } from "../../../../../assets/images/ui/ui.asset.js";
import { SPECIES_DATABASE } from "../../../../../shareds/pokemon/species/species.database.js";
import { getAnimationConfig } from "../../../../../shareds/utils/pokemon/animations/pokemonAnimations.utils.js";
import { Slot } from "../../../../Slot/Slot.model.js";
import { SpriteViewer } from "../../../../SpriteViewer/SpriteViewer.model.js";

export class EvolutionSequence {
  constructor(game, pokemon) {
    this.phase = null;
    this.game = game;
    this.pokemon = pokemon;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.isOpen = false;
    this.hasStarted = false;
    this.viewer = {
      old: null,
      evolved: null,
    };
    this.slot = new Slot({
      positionX: 112,
      positionY: 95,
      width: 100,
      height: 100,
    });
    this.backgImg = evolutionBackgImg;
    this.phaseTimer = 120;
    this.opacity = 0;
    this.scale = 1;
    this.shake = 0;
    this.evolvedFormSpecies = this.getEvolvedForm();
  }

  getEvolvedForm() {
    const foundedEvolved = SPECIES_DATABASE[this.pokemon.id].evolutions[0];
    return SPECIES_DATABASE[foundedEvolved.target];
  }

  open() {
    this.isOpen = true;
    this.showPokemonNeedsEvolve();
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
    this.drawBackgImage(context);
  }

  drawBackgImage(context) {
    context.drawImage(
      this.backgImg,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  introAnimation(context) {
    this.opacity += 0.01;
    this.scale += 0.002;

    if (this.scale >= 1.05) this.scale = 1;

    context.fillStyle = `rgba(255,255,255,${this.opacity})`;
    context.fillRect(0, 0, this.width, this.height);

    if (this.opacity >= 0.5) {
      this.phase = "CHARGE";
      this.phaseTimer = 90;
    }
  }

  update(context) {
    if (!this.isOpen) return;

    if (!this.hasStarted && this.phaseTimer > 0) this.phaseTimer--;

    if (this.phaseTimer <= 0) this.start();

    this.draw(context);

    this.viewer?.old.update(context);
    this.viewer?.evolved?.update(context);

    switch (this.phase) {
      case "INTRO":
        this.introAnimation(context);
        console.log("INTRO");
        break;

      case "CHARGE":
        this.energyCharge();
        break;
    }
  }
}
