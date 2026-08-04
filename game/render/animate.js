import { draw } from "./draw.js";
import { update } from "./update.js";

let frameCount = 0;
let animationCount = 0;
let lastLog = performance.now();

const FPS = () => {
  animationCount++;
  frameCount++;
  const now = performance.now();
  if (now - lastLog > 1000) {
    console.log("FPS :", frameCount);
    frameCount = 0;
    lastLog = now;
  }
};

export const animate = (game, tileManager) => {
  requestAnimationFrame(() => animate(game, tileManager));
  FPS();

  game.canvas.clear();
  game.canvas.draw();

  if (game.player) game.camera.follow(game.player);

  draw(game, tileManager);
  update(game);

  game.transition.draw(game.canvas);
};
