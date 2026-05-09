export const HUD = (context, battleManager) => {
  const nameX = 30;
  const nameY = 10;

  context.fillText(battleManager.enemy.name, nameX, nameY);
  const nameWidth = context.measureText(battleManager.enemy.name).width;

  context.fillText(battleManager.enemy.level, 149, 10);
  context.fillText("N.", 135, 10);

  battleManager.fontParams(context, "12");

  const genderX = 31;
  context.fillText(battleManager.enemy.gender, genderX + nameWidth, 14);

  battleManager.fontParams(context, "19");

  const pvX = 65;
  const pvY = 30;

  context.fillText("PV", pvX, pvY);

  battleManager.drawHpBar(context, 88, 37, 70, 6, 50, 50);
};
