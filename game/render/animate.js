// import { Canvas } from "../models/Canvas/Canvas.model.js";
import { draw } from "./draw.js";
import { update } from "./update.js";

// export const canvas = new Canvas(document.getElementById("canvas"));

export const animate = (game, tileManager) => {
  requestAnimationFrame(() => animate(game, tileManager));

  game.canvas.clear();
  game.canvas.drawImage();
  // game.camera.follow(game.player);

  draw(game, tileManager);
  update(game);
};
