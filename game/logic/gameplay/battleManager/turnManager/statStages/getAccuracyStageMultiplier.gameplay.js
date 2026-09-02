const STAGE_MULTIPLIERS = {
  "-6": [2, 8],
  "-5": [2, 7],
  "-4": [2, 6],
  "-3": [2, 5],
  "-2": [2, 4],
  "-1": [2, 3], // 100 × 2/3
  0: [2, 2],
  1: [3, 2],
  2: [4, 2],
  3: [5, 2],
  4: [6, 2],
  5: [7, 2],
  6: [8, 2],
};

export const getAccuracyStageMultiplier = (stage) => {
  const [numerator, denominator] =
    STAGE_MULTIPLIERS[Math.max(-6, Math.min(6, stage))];

  return numerator / denominator;
};
