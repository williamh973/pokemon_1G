export const drawHpBar = (context, x, y, width, height, currentHp, maxHp) => {
  const radius = height / 2;

  const hpPercent = Math.max(0, currentHp / maxHp);
  const hpWidth = width * hpPercent;

  context.fillStyle = "#3a3a3a";

  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();

  if (hpPercent > 0.5) context.fillStyle = "#48d048";
  else if (hpPercent > 0.2) context.fillStyle = "#f0c040";
  else context.fillStyle = "#e04040";

  context.beginPath();
  context.roundRect(x, y, hpWidth, height, radius);
  context.fill();
};
