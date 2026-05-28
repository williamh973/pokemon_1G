export const BATTLE_DIALOGS = {
  wildPokemonAppears: (pokemon) => `Un ${pokemon} sauvage apparait!`,

  trainerWantsToFight: (trainer) => `${trainer} veut se battre!`,

  trainerSentOutPokemon: (trainer, pokemon) => `${trainer} envoie ${pokemon} !`,

  returnPokemon: (pokemon) => `${pokemon} reviens !`,

  playerSentOutPokemon: (pokemon) => `${pokemon} ! À toi !`,

  playerLoseBattle: (player) =>
    `${player} n'a plus de pokémon en forme et se hâte vers le centre pokémon le plus proche`,

  trainerDefeated: (player, trainer, pokeDollar) =>
    `${trainer} a été vaincu, ${player} gagne ${pokeDollar} P$`,

  wildPokemonEscaped: (pokemon) => `${pokemon} sauvage s'est échappé !`,

  pokemonCaptured: (pokemon) => `${pokemon} est capturé !`,

  pokemonAddedToParty: (pokemon) => `${pokemon} rejoint votre équipe !`,

  pokemonSentToPc: (pokemon) => `${pokemon} a été envoyé au PC.`,
};
