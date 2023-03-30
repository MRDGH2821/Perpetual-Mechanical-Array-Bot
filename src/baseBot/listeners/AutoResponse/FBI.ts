import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean } from '../../lib/Utilities';
import CoolDownManager from '../../../lib/CoolDownManager';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('FBI_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_FBI),
  event: Events.MessageCreate,
  name: 'FBI Autoresponse',
})
export default class FBIResponse extends Listener<typeof Events.MessageCreate> {
  static FBIQuotes = [
    'You know what, I wonder if its actually NSA which spies or FBI :thinking:',
    'https://tenor.com/view/traffic-fbi-open-up-raid-gif-13450966',
    '*FBI is coming*',
  ]
    .concat(getQuotes('FBIGifs'), getQuotes('FBIQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    console.debug(content);

    if (message.channelId === '840268374621945906') {
      console.debug('Skipping TC chat');
      return;
    }

    if (!content.toLowerCase().includes('fbi')) {
      console.debug('Skipping a non fbi msg');
      return;
    }

    if (message.author.bot) {
      console.debug('Skipping bot msg');
      return;
    }
    try {
      const isLimited = rateLimit.check('FBI_ICD');
      if (isLimited < 1 || isLimited === false) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(FBIResponse.FBIQuotes),
          })
          .then(() => {
            rateLimit.add('FBI_ICD', 3000);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
