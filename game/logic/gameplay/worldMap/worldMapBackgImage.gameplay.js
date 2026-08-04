import { drawBox } from "../../../shareds/utils/box/box.utils.js";

export const drawBackgImage = (context, worldMap) => {
  drawBox(
    context,
    worldMap.position.x,
    worldMap.position.y,
    worldMap.game.canvas.width,
    worldMap.game.canvas.height,
    "black",
    "black"
  );
};
