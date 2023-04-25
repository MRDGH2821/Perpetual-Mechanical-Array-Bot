import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import { Message, userMention } from 'discord.js';
import CoolDownManager from '../../../lib/CoolDownManager';
import QuotesManager from '../../lib/QuotesManager';
import { parseBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Yoyoverse_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: parseBoolean(process.env.AUTORESPONSE_YOYOVERSE),
  event: Events.MessageCreate,
  name: 'Yoyoverse Autoresponse',
})
export default class YoyoverseResponse extends Listener<typeof Events.MessageCreate> {
  private static pelon = userMention('476219631539847188');

  static YoyoverseQuotes = [`Did you know that saying yoyoverse pings ${YoyoverseResponse.pelon}`]
    .concat(QuotesManager.getQuotes('yoyoverseQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;

    if (message.channelId === '840268374621945906') {
      return;
    }

    if (!content.toLowerCase().includes('yoyoverse')) {
      return;
    }

    if (message.author.bot) {
      return;
    }
    try {
      const isLimited = rateLimit.check('Yoyoverse_ICD');
      if (isLimited < 1) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(YoyoverseResponse.YoyoverseQuotes),
          })
          .then(() => {
            rateLimit.add('Yoyoverse_ICD', 3000);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
