export const calculateCriticalHit = (damages, action) => {
  if (action.move.power <= 0) return { damages, isCriticalHit: false };

  const random100 = Math.floor(Math.random() * 100) + 1;

  if (random100 > 6.25) return { damages, isCriticalHit: false };

  const criticalHitPercent =
    (2 * action.pokemon.level + 5) / (action.pokemon.level + 5);

  return {
    damages: damages * criticalHitPercent,
    isCriticalHit: true,
  };
};
