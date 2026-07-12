import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";

export const checkEvolution = (pokemon) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const evolutions = SPECIES.evolutions;
  const foundedEvolution = evolutions.find((evolution) => evolution);

  if (foundedEvolution && foundedEvolution.level !== pokemon.level)
    return {
      success: false,
    };

  if (foundedEvolution.method === "level") {
    const evolutionText = `Quoi ! ${pokemon.name} évolue !`;
    return {
      success: true,
      text: evolutionText,
    };
  }
};
