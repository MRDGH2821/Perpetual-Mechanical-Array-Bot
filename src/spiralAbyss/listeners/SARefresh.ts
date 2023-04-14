import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'SARefresh',
  name: 'Spiral Abyss Cache Refresher',
})
export default class HoFRefresh extends Listener {
  public run() {
    container.logger.debug('Preparing Spiral Abyss Cache');
    SpiralAbyssCache.prepareCache().then(() => {
      container.logger.debug('Spiral Abyss Cache Ready!');
      process.env.SPIRAL_ABYSS_READY = 'true';
    });
  }
}
