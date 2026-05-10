import { drawBox } from "../../../shareds/utils/box/box.utils.js";

export const backgroundBox = (context, battleManager) => {
  // drawBox(
  //   context,
  //   battleManager.position.x,
  //   battleManager.position.y,
  //   battleManager.width,
  //   battleManager.height,
  //   "black",
  //   "white"
  // );
  context.drawImage(
    battleManager.backgImage,
    battleManager.position.x,
    battleManager.position.y,
    battleManager.width,
    battleManager.height
  );
};
