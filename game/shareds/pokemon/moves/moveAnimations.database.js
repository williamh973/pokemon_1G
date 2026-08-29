import { EmberAnimation } from "../../../models/pokemon/Move/animations/EmberAnimation.model.js";
import { GrowlAnimation } from "../../../models/pokemon/Move/animations/GrowlAnimation.model.js";
import { QuickAttackAnimation } from "../../../models/pokemon/Move/animations/QuickAttackAnimation.model.js";
import { ScratchAnimation } from "../../../models/pokemon/Move/animations/ScratchAnimation.model.js";
import { TackleAnimation } from "../../../models/pokemon/Move/animations/TackleAnimation.model.js";
import { TailWhipAnimation } from "../../../models/pokemon/Move/animations/TailwhipAnimation.model.js";

export const MOVE_ANIMATIONS_DATABASE = {
  tackle: TackleAnimation,
  tailWhip: TailWhipAnimation,
  growl: GrowlAnimation,
  ember: EmberAnimation,
  scratch: ScratchAnimation,
  quickAttack: QuickAttackAnimation,
  //   watergun: WaterGunAnimation,
};
