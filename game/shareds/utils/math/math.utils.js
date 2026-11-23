export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 <= percent;
};
