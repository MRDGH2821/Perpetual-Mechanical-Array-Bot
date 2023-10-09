import { ApplyOptions } from '@sapphire/decorators';
import {
  container, Events, Listener, type ListenerOptions,
} from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import CoolDownManager from '../../../lib/CoolDownManager';
import QuotesManager from '../../lib/QuotesManager';
import { parseBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('TikTok_ICD', 3000);

const isEnabled = () => parseBoolean(process.env.AUTORESPONSE_TIKTOK);
@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'TikTok Autoresponse',
})
export default class TikTokResponse extends Listener<typeof Events.MessageCreate> {
  static Quote = () => pickRandom(
    [
      'Do this\n https://tenor.com/view/tiktok-tiktokbad-bad-trash-garbage-gif-21041014',
      'https://cdn.discordapp.com/attachments/803459900180004904/1005441017375367208/image0.gif',
      'https://tenor.com/view/tiktok-tiktok-cringe-watermark-tiktok-watermark-watermark-cringe-gif-22182993',
      'Somebody mentioned TikTok?!?!?!??!? \n\n*Dies of cringe*',
    ]
      .concat(QuotesManager.getQuotes('TikTokGifs'), QuotesManager.getQuotes('TikTokQuotes'))
      .flat(),
  );

  public run(message: Message) {
    const { content } = message;

    if (!isEnabled()) {
      return;
    }

    if (message.channelId === '840268374621945906') {
      return;
    }

    if (!content.toLowerCase().includes('tiktok')) {
      return;
    }

    if (message.author.bot) {
      return;
    }
    try {
      const isLimited = rateLimit.check('TikTok_ICD');
      if (isLimited < 1) {
        const { channel } = message;
        channel
          .send({
            content: TikTokResponse.Quote(),
          })
          .then((msg) => {
            rateLimit.add('TikTok_ICD', 3000);
            this.deleteMsg(msg);
          })
          .catch(container.logger.debug);
      }
    } catch (e) {
      container.logger.debug(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private deleteMsg(message: Message) {
    setTimeout(async () => {
      await message.delete();
    }, 5 * Time.Second);
  }
}
