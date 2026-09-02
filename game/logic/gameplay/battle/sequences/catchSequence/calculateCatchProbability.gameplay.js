import { getSpeciesData } from "../../../../../shareds/utils/pokemon/species/species.utils.js";

export const calculateCatchProbability = (usedItem, wildPokemon) => {
  const firstFormulaValue = generateFirstFormula(usedItem, wildPokemon);
  const maxSpeciesCatchRate = 255;
  let isCaptureGuaranteed = false;
  let randoms = [];

  firstFormulaValue > maxSpeciesCatchRate
    ? (isCaptureGuaranteed = true)
    : (isCaptureGuaranteed = false);
  // isCaptureGuaranteed = true; // dev only

  const secondFormulaValue = generateSecondFormula(firstFormulaValue);
  const randomCount = 4;

  for (let i = 0; i < randomCount; i++) {
    // Si ces quatre nombres sont tous inférieurs ou égaux à secondFormulaValue, isCaptureGuaranteed passe à true et le pokémon est attrapé.
    isCaptureGuaranteed ? randoms.push(0) : randoms.push(getRandom65535());
  }

  return { randoms, secondFormulaValue };
};

const generateFirstFormula = (usedItem, wildPokemon) => {
  const speciesCatchRate = getSpeciesData(wildPokemon.id).catchRate;
  const ballCatchRate = usedItem.value;
  const statutBonus = 1;

  return Math.floor(
    (ballCatchRate -
      ((2 / 3) * wildPokemon.stats.hp) / wildPokemon.stats.maxHp) *
      speciesCatchRate *
      ballCatchRate *
      statutBonus
  );
};

const generateSecondFormula = (firstFormulaValue) => {
  return (
    Math.floor((Math.pow(2, 16) - 1) * firstFormulaValue) /
    Math.floor((Math.pow(2, 8) - 1) * 1) // 6
  );
};

const getRandom65535 = () => {
  return Math.floor(Math.random() * 65535);
};
