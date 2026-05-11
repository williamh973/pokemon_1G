export function getExpForLevel(level, growthRate) {
  switch (growthRate) {
    case "FAST":
      return (4 * Math.pow(level, 3)) / 5;

    case "MEDIUM_FAST":
      return Math.pow(level, 3);

    case "MEDIUM_SLOW":
      return (
        (6 / 5) * Math.pow(level, 3) -
        15 * Math.pow(level, 2) +
        100 * level -
        140
      );

    case "SLOW":
      return (5 * Math.pow(level, 3)) / 4;
  }
}
