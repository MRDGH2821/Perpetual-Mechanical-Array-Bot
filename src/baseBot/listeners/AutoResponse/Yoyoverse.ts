import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import { Message, userMention } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean } from '../../lib/Utilities';
import CoolDownManager from '../../../lib/CoolDownManager';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Yoyoverse_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_YOYOVERSE),
  event: Events.MessageCreate,
  name: 'Yoyoverse Autoresponse',
})
export default class YoyoverseResponse extends Listener<typeof Events.MessageCreate> {
  private static pelon = userMention('476219631539847188');

  static YoyoverseQuotes = [`Did you know that saying yoyoverse pings ${YoyoverseResponse.pelon}`]
    .concat(getQuotes('yoyoverseQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    console.debug(content);

    if (message.channelId === '840268374621945906') {
      console.debug('Skipping TC chat');
      return;
    }

    if (!content.toLowerCase().includes('yoyoverse')) {
      console.debug('Skipping a non yoyoverse msg');
      return;
    }

    if (message.author.bot) {
      console.debug('Skipping bot msg');
      return;
    }
    try {
      const isLimited = rateLimit.check('Yoyoverse_ICD');
      if (isLimited < 1 || isLimited === false) {
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
