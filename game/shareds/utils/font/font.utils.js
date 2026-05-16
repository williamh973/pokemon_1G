export const textParams = (context, weight, color = "black") => {
  context.fillStyle = color;
  context.textBaseline = "top";
  context.font = `${weight}px PixelOperator `;
};

export const serialize = (list) =>
  list
    .filter((item) => item.id !== "RETOUR")
    .map((item) => ({
      id: item.id,
      count: item.count,
    }));
