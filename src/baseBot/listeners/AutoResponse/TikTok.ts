import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { RateLimitManager } from '@sapphire/ratelimits';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean } from '../../lib/Utilities';

const rateLimitManager = new RateLimitManager(3000);
const rateLimit = rateLimitManager.acquire('TikTok_ICD');
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_TIKTOK),
  event: Events.MessageCreate,
  name: 'TikTok Autoresponse',
})
export default class TikTokResponse extends Listener<typeof Events.MessageCreate> {
  static TikTokQuotes = ['Somebody mentioned TikTok?!?!?!??!?!??!\n\n*Dies of cringe*']
    .concat(getQuotes('TikTokGifs'), getQuotes('TikTokQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    const { logger } = message.client;
    logger.debug(content);

    if (message.channelId === '840268374621945906') {
      logger.debug('Skipping TC chat');
      return;
    }

    if (!content.toLowerCase().includes('tiktok')) {
      logger.debug('Skipping a non TikTok msg');
      return;
    }

    if (message.author.bot) {
      logger.debug('Skipping bot msg');
      return;
    }

    if (!rateLimit.limited) {
      const { channel } = message;
      channel
        .send({
          content: pickRandom(TikTokResponse.TikTokQuotes),
        })
        .then((msg) => {
          rateLimit.consume();
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
    }
  }
}
