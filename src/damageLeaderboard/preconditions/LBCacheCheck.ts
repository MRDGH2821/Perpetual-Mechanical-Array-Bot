import { Precondition } from '@sapphire/framework';
import HallOfFameCache from '../lib/LeaderboardCache';

export default class HoFCacheCheck extends Precondition {
  public override chatInputRun() {
    return HallOfFameCache.isCacheReady()
      ? this.ok()
      : this.error({
        context: 'Hall of Fame cache not ready',
        message: 'Please wait before using Hall of fame commands as cache is not ready',
      });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    HoFCacheCheck: never;
  }
}
