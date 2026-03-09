export const face = (a, b) => {
  return (game, done) => {
    a.setFacing(a.getFacingToward(b));

    done();
  };
};
