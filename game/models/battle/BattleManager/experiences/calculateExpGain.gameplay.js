import { SPECIES_DATABASE } from "../../../../shareds/pokemon/species/species.database.js";

export const calculateExpGain = (fainted) => {
  const species = SPECIES_DATABASE[fainted.id];

  if (!species) {
    throw new Error(
      `Impossible de calculer l'EXP : espèce inconnue "${fainted.id}"`
    );
  }

  const baseExp = species.baseExp;
  const defeatedLevel = fainted.level;

  return Math.floor((baseExp * defeatedLevel) / 7);
};
