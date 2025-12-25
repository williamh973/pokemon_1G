import { draw } from "./draw.js";
import { update } from "./update.js";

let frameCount = 0;
let animationCount = 0;
let lastLog = performance.now();

export const animate = (game, tileManager) => {
  animationCount++;
  requestAnimationFrame(() => animate(game, tileManager));

  frameCount++;
  const now = performance.now();
  if (now - lastLog > 1000) {
    console.log("FPS :", frameCount);
    frameCount = 0;
    lastLog = now;
  }

  game.canvas.clear();
  game.canvas.drawImage();

  game.camera.follow(game.player);
  draw(game, tileManager);
  update(game);
};
