import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import HallOfFameCache from '../lib/HallOfFameCache';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'HoFRefresh',
  name: 'Hall of Fame Cache Refresher',
})
export default class UserEvent extends Listener {
  public run() {
    HallOfFameCache.prepareCache().then(() => {
      this.container.logger.debug('Hall of Fame Cache Ready!');
      process.env.HALL_OF_FAME_READY = 'true';
    });
  }
}
