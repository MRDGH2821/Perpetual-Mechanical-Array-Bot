import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type ListenerOptions } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import HallOfFameCache from '../lib/HallOfFameCache';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'HoFRefresh',
  name: 'Hall of Fame Cache Refresher',
})
export default class HoFRefresh extends Listener {
  public run() {
    process.env.HALL_OF_FAME_READY = 'false';
    this.container.logger.info('Preparing Hall Of Fame Cache');
    HallOfFameCache.prepareCache().then(() => {
      this.container.logger.info('Hall of Fame Cache Ready!');
      process.env.HALL_OF_FAME_READY = 'true';
    });
  }
}
