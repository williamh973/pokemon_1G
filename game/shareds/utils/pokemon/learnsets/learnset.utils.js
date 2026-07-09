import { getSpeciesData } from "../species/species.utils.js";

export const checkLearnset = (pokemon) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const learnsets = SPECIES.learnset.levelUp;

  const foundedLearnset = learnsets.find(
    (learnset) => learnset.level === pokemon.level
  );

  if (foundedLearnset) {
    const moves = pokemon.moves.length;
    if (moves >= 4) {
      const wouldLikeLearnText = `${pokemon.name} voudrait apprendre \n ${foundedLearnset?.move.name} \n mais ${pokemon.name} possède déjà 4 capacités.`;
      return {
        success: false,
        text: wouldLikeLearnText,
      };
    } else {
      const learnMoveText = `${pokemon.name} apprend ${foundedLearnset?.move.name} !`;
      return {
        success: true,
        text: learnMoveText,
      };
    }
  } else
    return {
      noLearset: true,
    };
};
