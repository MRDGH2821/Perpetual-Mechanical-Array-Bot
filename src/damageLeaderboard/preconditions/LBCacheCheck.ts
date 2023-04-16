import { Precondition } from '@sapphire/framework';
import LeaderboardCache from '../lib/LeaderboardCache';

export default class LBCacheCheck extends Precondition {
  public override chatInputRun() {
    return LeaderboardCache.isCacheReady()
      ? this.ok()
      : this.error({
        context: 'Hall of Fame cache not ready',
        message: 'Please wait before using Hall of fame commands as cache is not ready',
      });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    LBCacheCheck: never;
  }
}
