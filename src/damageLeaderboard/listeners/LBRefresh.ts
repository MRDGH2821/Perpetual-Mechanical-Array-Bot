import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import LeaderboardCache from '../lib/LeaderboardCache';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBRefresh',
  name: 'Leaderboard Cache Refresher',
})
export default class HoFRefresh extends Listener {
  public run() {
    LeaderboardCache.prepareCache().then(() => {
      container.logger.debug('Leaderboard Cache Ready!');
      process.env.LEADERBOARD_READY = 'true';
    });
  }
}
