export const calculateCriticalHit = (damages, action) => {
  const move = action.move;
  const pokemon = action.pokemon;
  const hasBoostedByFocusEnergy = pokemon.volatils.hasBoostedByFocusEnergy;

  const criticalHitBasicRate = 6.25;
  const criticalHitBoostedRate = 50;

  const criticalHitRate = hasBoostedByFocusEnergy
    ? criticalHitBoostedRate
    : criticalHitBasicRate;

  if (move.power <= 0) return { damages, isCriticalHit: false };

  const random100 = Math.floor(Math.random() * 100) + 1;

  if (random100 > criticalHitRate) return { damages, isCriticalHit: false };

  const criticalHitPercent = (2 * pokemon.level + 5) / (pokemon.level + 5);

  return {
    damages: damages * criticalHitPercent,
    isCriticalHit: true,
  };
};
