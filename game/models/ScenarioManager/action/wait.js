export const wait = (duration) => {
  return (game, done) => {
    let waitCooldown = 0;

    if (waitCooldown < duration) waitCooldown++;
    if (waitCooldown === duration) {
      waitCooldown = 0;
      done();
    }
  };
};
