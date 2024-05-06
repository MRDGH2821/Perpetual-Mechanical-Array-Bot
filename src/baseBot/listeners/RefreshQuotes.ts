import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type ListenerOptions } from '@sapphire/framework';
import { QUOTE_CATEGORIES } from '../../lib/DynamicConstants';
import QuotesManager from '../lib/QuotesManager';
import { PMAEventHandler } from '../lib/Utilities';

@ApplyOptions<ListenerOptions>({
  name: 'RefreshQuotes',
  emitter: PMAEventHandler,
  event: 'RefreshQuotes',
  enabled: true,
})
export default class RefreshQuotesEvent extends Listener {
  public async run() {
    const { logger } = this.container;
    const promises: Promise<void>[] = [];
    logger.info('Refreshing quotes');
    QUOTE_CATEGORIES.forEach((category) => {
      const promise = QuotesManager.prepareCache(category)
        .then(() => logger.debug(`Quotes refreshed from ${category}`))
        .catch(logger.error);
      promises.push(promise);
    });

    await Promise.all(promises)
      .then(() => logger.info('Quotes refresh done'))
      .catch(logger.error);
  }
}
