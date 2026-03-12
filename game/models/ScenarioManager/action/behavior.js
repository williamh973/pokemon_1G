export const behavior = (character, behavior) => {
  return (game, done) => {
    character.behavior = behavior;
    done();
  };
};
