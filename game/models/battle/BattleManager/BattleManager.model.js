import { backgroundBox } from "../../../render/battle/battleRenderer/background.render.js";
import { drawHpBar } from "../../../render/battle/battleRenderer/hpBars.render.js";
import { HUD } from "../../../render/battle/battleRenderer/huds.render.js";
import { drawBox } from "../../../shareds/utils/box/box.utils.js";
import { PokemonViewer } from "../../PokemonViewer/PokemonViewer.model.js";
import { Slot } from "./BattleSlot/BattleSlot.model.js";

export class BattleManager {
  constructor(
    game,
    isTrainerBattle = false,
    wildPokemon = null,
    trainer = null
  ) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.game = game;
    this.name = "BATTLE";
    this.canvas = this.game.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.isOpen = false;
    this.isTrainerBattle = isTrainerBattle;
    this.weather = this.game.flags.weather;
    this.frontViewer = null; // sprite du dresseur ou pokemon adverse
    this.backViewer = null; // sprite du joureur de dos ou de ses pokémons
    this.enemy = wildPokemon; // pokemon sauvage généré pendant une rencontre
    this.trainer = trainer; // dresseur adverse rencontré
    this.frontSlot = new Slot(180, 10, 120, 120);
    this.backSlot = new Slot(20, 130, 120, 120);
  }

  open() {
    this.isOpen = true;
    this.openPokemonViewer();
    this.openDialogBox();
  }

  openDialogBox() {
    // this.game.dialogBox.open(this.enemy, true);
    // this.game.dialogBox.hasFocus = true;
  }

  openPokemonViewer() {
    this.frontViewer = new PokemonViewer(
      this.game,
      this.enemy,
      this.frontSlot,
      "front"
    );
    this.backViewer = new PokemonViewer(
      this.game,
      this.enemy,
      this.backSlot,
      "back"
    );
    this.frontViewer.isOpen = true;
    this.backViewer.isOpen = true;
  }

  close() {
    this.closePokemonViewer();
    this.game.dialogBox.close();
    this.isOpen = false;
  }

  // closePokemonViewer() {
  //   this.frontViewer.isOpen = false;
  //   this.frontViewer.pokemonSprite = null;
  //   this.frontViewer = null;
  // }

  resetCurrentScreen() {
    this.game.resetCurrentScreen();
  }

  backgroundBox(context) {
    backgroundBox(context, this);
  }

  draw(context) {
    context.fillStyle = "white";

    this.backgroundBox(context);
    this.pokemonHuds(context);
  }

  fontParams(context, weight) {
    context.font = `${weight}px PixelOperator `;
  }

  pokemonHuds(context) {
    this.fontParams(context, "18");
    context.fillStyle = "black";
    this.HUDs(context);
  }

  HUDs(context) {
    HUD(context, this);
  }

  drawHpBar(context, x, y, width, height, currentHp, maxHp) {
    drawHpBar(context, x, y, width, height, currentHp, maxHp);
  }

  slideAnimation() {
    // const finalPosX = this.frontViewer.pokemonSprite.position.x;
    // console.log(finalPosX);
    // this.frontViewer.pokemonSprite.position.x =
    //   0 - this.frontViewer.pokemonSprite.config.frameWidth;
    // if (this.frontViewer.pokemonSprite.position.x < finalPosX) {
    //   this.frontViewer.pokemonSprite.position.x += 2;
    // }
    // console.log(this.frontViewer.pokemonSprite);
  }

  update(context, action) {
    if (!this.isOpen) return;
    this.draw(context);
    this.frontViewer?.update(context, null);
    this.backViewer?.update(context, null);

    this.slideAnimation();

    if (this.game.dialogBox.isOpen) {
      const result = this.game.dialogBox.update(
        this.game.canvas.context,
        action
      );
    }
  }
}
