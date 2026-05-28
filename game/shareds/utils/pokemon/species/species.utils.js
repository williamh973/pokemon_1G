import { SPECIES_DATABASE } from "../../../pokemon/species/species.database.js";

export const getSpeciesData = (pokemonId) => {
  return SPECIES_DATABASE[pokemonId];
};
