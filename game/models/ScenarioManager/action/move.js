export const move = (character, direction, steps = 1) => {
  return (game, done) => {
    const path = Array(steps).fill(direction);

    character.startForcedMovement(path);

    character.addMovementCallback(() => {
      done();
    });
  };
};

export const sequenceMove = (
  firstCharacter,
  firstPath,
  secondCharacter,
  secondPath
) => {
  return (game, done) => {
    firstCharacter.startForcedMovement(firstPath);
    secondCharacter.startForcedMovement(secondPath);

    firstCharacter.addMovementCallback(() => {
      done();
    });

    secondCharacter.addMovementCallback(() => {
      done();
    });
  };
};
