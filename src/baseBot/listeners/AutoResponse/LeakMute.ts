import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean } from '../../lib/Utilities';
import CoolDownManager from '../../../lib/CoolDownManager';
import { ChannelIds } from '../../../lib/Constants';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Leaks_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_FBI),
  event: Events.MessageCreate,
  name: 'Leaks Autoresponse',
})
export default class LeakMuteResponse extends Listener<typeof Events.MessageCreate> {
  static LeakQuotes = [
    'You are asking for leaks?',
    'Just give up asking for leaks',
    'Simply go to other server and ask there',
  ]
    .concat(getQuotes('leakQuotes'))
    .flat();

  static LeakReasons = ['Spoke the forbidden word ||leak||']
    .concat(getQuotes('leaksMuteReasons'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    console.debug(content);

    if (message.channelId !== ChannelIds.LEAKS_DISCUSSION) {
      console.debug('Skipping non leaks chat');
      return;
    }

    if (!content.toLowerCase().includes('leak')) {
      console.debug('Skipping a non leak msg');
      return;
    }

    if (message.author.bot) {
      console.debug('Skipping bot msg');
      return;
    }
    try {
      const isLimited = rateLimit.check('Leaks_ICD');
      if (isLimited < 1 || isLimited === false) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(LeakMuteResponse.LeakQuotes),
          })
          .then(() => {
            rateLimit.add('Leaks_ICD', 3000);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
