export function getExpForLevel(level, growthRate) {
  switch (growthRate) {
    case "FAST":
      return Math.floor((4 * Math.pow(level, 3)) / 5);

    case "MEDIUM_FAST":
      return Math.floor(Math.pow(level, 3));

    case "MEDIUM_SLOW":
      return Math.floor(
        (6 / 5) * Math.pow(level, 3) -
          15 * Math.pow(level, 2) +
          100 * level -
          140
      );

    case "SLOW":
      return Math.floor((5 * Math.pow(level, 3)) / 4);
  }
}
