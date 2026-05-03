export const updateSprite = (character) => {
  const hasIdle = character.sprites.idle;

  let state = character.state;

  if (!hasIdle || character.alwaysAnimate) state = "walk";

  character.image = character.sprites[state][character.facing];

  if (Array.isArray(character.image)) {
    character.framesMax = character.image.length;
    character.image =
      character.image[character.framesCurrent % character.framesMax];
  } else character.framesMax = 1;
};
