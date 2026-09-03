export const checkDialogBoxShakeAnimation = (battleManager, damages) => {
  if (damages > 0) {
    battleManager.game.dialogBox.startShakeAnimation({
      axe: "y",
      shakeDistance: 5,
      shakeSpeed: 4,
      maxShakeCount: 4,
    });
  } else {
    battleManager.game.dialogBox.startShakeAnimation({
      axe: "x",
      shakeDistance: 10,
      shakeSpeed: 4,
      maxShakeCount: 2,
    });
  }
};
