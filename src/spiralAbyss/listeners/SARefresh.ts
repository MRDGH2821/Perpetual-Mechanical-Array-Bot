import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type ListenerOptions } from '@sapphire/framework';
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
    process.env.SPIRAL_ABYSS_READY = 'false';
    this.container.logger.info('Preparing Spiral Abyss Cache');
    SpiralAbyssCache.prepareCache().then(() => {
      this.container.logger.info('Spiral Abyss Cache Ready!');
      process.env.SPIRAL_ABYSS_READY = 'true';
    });
  }
}
