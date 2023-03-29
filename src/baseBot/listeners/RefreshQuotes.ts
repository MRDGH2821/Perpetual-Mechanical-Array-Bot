import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, Logger, LogLevel } from '@sapphire/framework';
import { QUOTE_CATEGORIES } from '../../lib/DynamicConstants';
import { setDBQuotes } from '../lib/QuotesManager';
import { PMAEventHandler } from '../lib/Utilities';

@ApplyOptions<ListenerOptions>({
  name: 'RefreshQuotes',
  emitter: PMAEventHandler,
  event: 'RefreshQuotes',
  enabled: true,
})
export default class UserEvent extends Listener {
  public async run() {
    const logger = new Logger(LogLevel.None);
    const promises: Promise<void>[] = [];
    logger.info('Refreshing quotes');
    QUOTE_CATEGORIES.forEach((category) => {
      const promise = setDBQuotes(category)
        .then(() => {
          logger.info(`Quotes refreshed from ${category}`);
        })
        .catch(logger.error);
      promises.push(promise);
    });

    await Promise.all(promises)
      .then(() => {
        logger.info('Quotes refresh done');
      })
      .catch(logger.error);
  }
}
