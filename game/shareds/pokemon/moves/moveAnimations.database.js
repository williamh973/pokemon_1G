import { AcidAnimation } from "../../../models/pokemon/Move/animations/AcidAnimation.model.js";
import { ScreechAnimation } from "../../../models/pokemon/Move/animations/ScreechAnimation.model.js";
import { EmberAnimation } from "../../../models/pokemon/Move/animations/EmberAnimation.model.js";
import { GrowlAnimation } from "../../../models/pokemon/Move/animations/GrowlAnimation.model.js";
import { GustAnimation } from "../../../models/pokemon/Move/animations/GustAnimation.model.js";
import { HardenAnimation } from "../../../models/pokemon/Move/animations/HardenAnimation.model.js";
import { LeechLifeAnimation } from "../../../models/pokemon/Move/animations/LeechLifeAnimation.model.js";
import { QuickAttackAnimation } from "../../../models/pokemon/Move/animations/QuickAttackAnimation.model.js";
import { SandAttackAnimation } from "../../../models/pokemon/Move/animations/SandAttackAnimation.model.js";
import { ScratchAnimation } from "../../../models/pokemon/Move/animations/ScratchAnimation.model.js";
import { TackleAnimation } from "../../../models/pokemon/Move/animations/TackleAnimation.model.js";
import { TailWhipAnimation } from "../../../models/pokemon/Move/animations/TailwhipAnimation.model.js";
import { ThunderWaveAnimation } from "../../../models/pokemon/Move/animations/ThunderWaveAnimation.model.js";
import { FocusEnergyAnimation } from "../../../models/pokemon/Move/animations/focusEnergyAnimation.model.js";
import { HypnosisAnimation } from "../../../models/pokemon/Move/animations/hypnosisAnimation.model.js";
import { IceBeamAnimation } from "../../../models/pokemon/Move/animations/iceBeamAnimation.model.js";
import { SupersonicAnimation } from "../../../models/pokemon/Move/animations/supersonicAnimation.model.js";
import { HyperBeamAnimation } from "../../../models/pokemon/Move/animations/HyperBeamAnimation.model.js";

export const MOVE_ANIMATIONS_DATABASE = {
  tackle: TackleAnimation,
  tailWhip: TailWhipAnimation,
  growl: GrowlAnimation,
  ember: EmberAnimation,
  scratch: ScratchAnimation,
  quickAttack: QuickAttackAnimation,
  gust: GustAnimation,
  sandAttack: SandAttackAnimation,
  hypnosis: HypnosisAnimation,
  iceBeam: IceBeamAnimation,
  thunderWave: ThunderWaveAnimation,
  acid: AcidAnimation,
  focusEnergy: FocusEnergyAnimation,
  harden: HardenAnimation,
  leechLife: LeechLifeAnimation,
  supersonic: SupersonicAnimation,
  screech: ScreechAnimation,
  hyperBeam: HyperBeamAnimation,
  //   watergun: WaterGunAnimation,
};
