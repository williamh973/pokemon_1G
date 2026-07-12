import { getSpeciesData } from "../../../../shareds/utils/pokemon/species/species.utils.js";

export const checkLearnset = (pokemon) => {
  const SPECIES = getSpeciesData(pokemon.id);
  const learnsets = SPECIES.learnset.levelUp;

  const foundedLearnset = learnsets.find(
    (learnset) => learnset.level === pokemon.level
  );
  const moves = pokemon.moves;

  if (foundedLearnset) {
    if (moves.length >= 4) {
      const wouldLikeLearnText = `${pokemon.name} voudrait apprendre \n ${foundedLearnset?.move.name} \n mais ${pokemon.name} possède déjà 4 capacités.`;
      return {
        success: false,
        text: wouldLikeLearnText,
      };
    } else {
      const learnMoveText = `${pokemon.name} apprend ${foundedLearnset?.move.name} !`;
      moves.push({
        id: foundedLearnset.move.id,
        name: foundedLearnset.move.name,
        type: foundedLearnset.move.type,
        class: foundedLearnset.move.class,
        currentPP: foundedLearnset.move.pp,
        maxPP: foundedLearnset.move.pp,
        power: foundedLearnset.move.power,
        precision: foundedLearnset.move.precision,
        desc: foundedLearnset.move.desc,
      });

      return {
        success: true,
        text: learnMoveText,
      };
    }
  } else
    return {
      noLearnset: true,
    };
};
