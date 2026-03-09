export const wait = (duration) => {
  return (game, done) => {
    setTimeout(done, duration);
  };
};
