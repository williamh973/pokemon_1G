export const textParams = (context, font) => {
  context.font = font;
  context.fillStyle = "black";
  context.textBaseline = "top";
};

export const serialize = (list) =>
  list
    .filter((item) => item.id !== "RETOUR")
    .map((item) => ({
      id: item.id,
      count: item.count,
    }));
