import { Precondition } from '@sapphire/framework';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';

export default class SACacheCheck extends Precondition {
  public override chatInputRun() {
    return SpiralAbyssCache.isCacheReady()
      ? this.ok()
      : this.error({
          context: 'Spiral Abyss cache not ready',
          message: 'Please wait before using Spiral Abyss commands as cache is not ready',
        });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    SACacheCheck: never;
  }
}
