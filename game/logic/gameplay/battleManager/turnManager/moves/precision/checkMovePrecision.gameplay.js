import { getAccuracyStageMultiplier } from "../../statStages/getAccuracyStageMultiplier.gameplay.js";

export const checkMovePrecision = (action) => {
  const random100 = Math.floor(Math.random() * 100) + 1;

  const accuracyStage = action.pokemon.statStages.accuracy;

  const accuracy =
    action.move.precision * getAccuracyStageMultiplier(accuracyStage);

  const isSuccessful = random100 <= accuracy;

  console.log(
    `${action.pokemon.name} utilise ${action.move.name}`,
    `| random: ${random100}`,
    `| précision de base: ${action.move.precision}`,
    `| précision réelle: ${accuracy}`,
    `| résultat: ${isSuccessful ? "RÉUSSI" : "RATÉ"}`
  );

  return isSuccessful;
};
