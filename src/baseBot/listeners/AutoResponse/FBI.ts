import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import CoolDownManager from '../../../lib/CoolDownManager';
import QuotesManager from '../../lib/QuotesManager';
import { parseBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('FBI_ICD', 3000);

const isEnabled = () => parseBoolean(process.env.AUTORESPONSE_FBI);
@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'FBI Autoresponse',
})
export default class FBIResponse extends Listener<typeof Events.MessageCreate> {
  static FBIQuotes = [
    '*FBI investigation commences*',
    '*FBI is coming*',
    'Did you know FBI stands for Faraway Buddy Insideyourdevice ?',
    'https://tenor.com/view/chicken-fbi-skeptic-chicken-funny-gif-14153035',
    'https://tenor.com/view/dark-red-fbi-warning-gif-18254979',
    'https://tenor.com/view/fbi-swat-busted-police-open-up-gif-16928811',
    'https://tenor.com/view/priyam-raj-fbi-meme-fbi-open-up-fbi-gamer-gif-19628656',
    'https://tenor.com/view/traffic-fbi-open-up-raid-gif-13450966',
    'Rick Astley was a part of F.B.I. ||(music band)||',
    'You know what, I wonder if its actually NSA which spies or FBI :thinking:',
  ]
    .concat(QuotesManager.getQuotes('FBIGifs'), QuotesManager.getQuotes('FBIQuotes'))
    .flat();

  public run(message: Message) {
    const { content } = message;

    if (!isEnabled()) {
      container.logger.debug('FBI Autoresponse is not enabled, thus not responding');
      return;
    }

    if (message.channelId === '840268374621945906') {
      container.logger.debug('Chanel Black listed, hence not responding');
      return;
    }

    if (!content.toLowerCase().includes('fbi')) {
      container.logger.debug('Not found FBI in message, hence not responding');
      return;
    }

    if (message.author.bot) {
      container.logger.debug('Message by bot, hence not responding');
      return;
    }
    try {
      const isLimited = rateLimit.check('FBI_ICD');
      if (isLimited < 1) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(FBIResponse.FBIQuotes),
          })
          .then(() => {
            rateLimit.add('FBI_ICD', 3000);
          })
          .catch(container.logger.debug);
      }
    } catch (e) {
      container.logger.debug(e);
    }
  }

  public override onLoad() {
    container.logger.debug(this.name, 'Loaded!');
  }
}
