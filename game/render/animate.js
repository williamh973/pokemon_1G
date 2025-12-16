// import { Canvas } from "../models/Canvas/Canvas.model.js";
import { update } from "./update.js";

// export const canvas = new Canvas(document.getElementById("canvas"));

export const animate = (game, tileManager) => {
  requestAnimationFrame(() => animate(game, tileManager));

  game.canvas.clear();
  game.canvas.drawImage();
  // game.camera.follow(game.player);

  tileManager.drawMap(
    game.canvas.context,
    game.currentMap,
    game.camera.offsetX,
    game.camera.offsetY
  );
  update(game);
};
