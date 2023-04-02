import { Time } from '@sapphire/time-utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean } from '../../lib/Utilities';
import CoolDownManager from '../../../lib/CoolDownManager';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('TikTok_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_TIKTOK),
  event: Events.MessageCreate,
  name: 'TikTok Autoresponse',
})
export default class TikTokResponse extends Listener<typeof Events.MessageCreate> {
  static TikTokQuotes = [
    'Do this\n https://tenor.com/view/tiktok-tiktokbad-bad-trash-garbage-gif-21041014',
    'https://cdn.discordapp.com/attachments/803459900180004904/1005441017375367208/image0.gif',
    'https://tenor.com/view/tiktok-tiktok-cringe-watermark-tiktok-watermark-watermark-cringe-gif-22182993',
    'Somebody mentioned TikTok?!?!?!??!? \n\n*Dies of cringe*',
  ]
    .concat(getQuotes('TikTokGifs'), getQuotes('TikTokQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;

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
      if (isLimited < 1 || isLimited === false) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(TikTokResponse.TikTokQuotes),
          })
          .then((msg) => {
            rateLimit.add('TikTok_ICD', 3000);
            this.deleteMsg(msg);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private deleteMsg(message: Message) {
    setTimeout(async () => {
      await message.delete();
    }, 5 * Time.Second);
  }
}
