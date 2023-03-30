import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message, TextChannel } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';
import { checkBoolean, freezeMuteUser } from '../../lib/Utilities';
import CoolDownManager from '../../../lib/CoolDownManager';
import { ChannelIds } from '../../../lib/Constants';

const rateLimit = new CoolDownManager(1000);
rateLimit.add('RNG_ICD', 1000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_FBI),
  event: Events.MessageCreate,
  name: 'Leaks Autoresponse',
})
export default class RNGMuteResponse extends Listener<typeof Events.MessageCreate> {
  static RNGQuotes = [
    'You are asking for leaks?',
    'Just give up asking for leaks',
    'Simply go to other server and ask there',
  ]
    .concat(getQuotes('RNGMuteQuotes'))
    .flat();

  static RNGMuteReasons = ['Spoke the forbidden word ||leak||']
    .concat(getQuotes('RNGMuteReasons'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    console.debug(content);

    if (message.channelId !== ChannelIds.RNG_MUTE) {
      console.debug('Skipping non rng-mute chat');
      return;
    }

    if (message.author.bot) {
      console.debug('Skipping bot msg');
      return;
    }
    try {
      const isLimited = rateLimit.check('RNG_ICD');
      if (isLimited < 1 || isLimited === false) {
        const { channel } = message;
        channel
          .send({
            content: pickRandom(RNGMuteResponse.RNGQuotes),
          })
          .then(async () => {
            if (!channel.isTextBased()) {
              return;
            }
            await freezeMuteUser({
              chance: 10,
              channel: channel as TextChannel,
              duration: 1000 * 60,
              member: message.member!,
              reason: pickRandom(RNGMuteResponse.RNGMuteReasons),
            });
            rateLimit.add('RNG_ICD', 3000);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
