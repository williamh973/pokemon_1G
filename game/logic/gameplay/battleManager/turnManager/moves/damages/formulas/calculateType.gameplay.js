import { SIMPLE_TYPE_INEFFECTIVE } from "../../../../../../../shareds/pokemon/types/ineffective/simple-type-ineffective.js";
import { SIMPLE_TYPE_RESISTANCE } from "../../../../../../../shareds/pokemon/types/resistance/simple-type-resistance.js";
import { SIMPLE_TYPE_WEAKNESS } from "../../../../../../../shareds/pokemon/types/weakness/simple-type-weakness.js";

const simpleType = (moveType, targetType, database, value) => {
  const findedMoveType = database[moveType];

  const isAffected = findedMoveType?.includes(targetType) ?? false;

  return {
    isAffected,
    value: isAffected ? value : 1,
  };
};

export const calculateType = (action, targetType) => {
  const moveType = action.move.type[0];

  console.log("moveType : ", moveType, "targetType : ", targetType);

  const simpleResistanceResult = simpleType(
    moveType,
    targetType,
    SIMPLE_TYPE_RESISTANCE,
    0.5
  );

  const simpleWeaknessResult = simpleType(
    moveType,
    targetType,
    SIMPLE_TYPE_WEAKNESS,
    2
  );

  const simpleIneffectiveResult = simpleType(
    moveType,
    targetType,
    SIMPLE_TYPE_INEFFECTIVE,
    0
  );

  if (simpleResistanceResult.isAffected) return simpleResistanceResult.value;
  if (simpleWeaknessResult.isAffected) return simpleWeaknessResult.value;
  if (simpleIneffectiveResult.isAffected) return simpleIneffectiveResult.value;

  return 1;
};
