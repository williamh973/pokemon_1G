import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";
const getStatLabel = (stat) => {
  const labels = {
    attack: "L'attaque",
    defense: "La défense",
    speed: "La vitesse",
    specialAtt: "L'attaque spéciale",
    defenseAtt: "La défense spéciale",
    accuracy: "La précision",
    evasion: "L'esquive",
  };

  return labels[stat] ?? stat;
};

export const handlerStatStagesEffectDialogs = (
  battleManager,
  moveEffectResult
) => {
  const intensity = Math.abs(moveEffectResult.amount) >= 2 ? "beaucoup" : "";

  moveEffectResult.isAffected
    ? battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.statStageChanged(
          getStatLabel(moveEffectResult.stat),
          moveEffectResult.pokemon.name,
          moveEffectResult.amount > 0 ? "monte" : "baisse",
          intensity
        )
      )
    : battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.statStageChangedNoMore(
          getStatLabel(moveEffectResult.stat),
          moveEffectResult.pokemon.name,
          moveEffectResult.amount > 0 ? "monter" : "baisser"
        )
      );
};
