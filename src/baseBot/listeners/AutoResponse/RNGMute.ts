import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message, TextChannel } from 'discord.js';
import { ChannelIds, EMOJIS, ROLE_IDS } from '../../../lib/Constants';
import CoolDownManager from '../../../lib/CoolDownManager';
import QuotesManager from '../../lib/QuotesManager';
import { freezeMuteUser } from '../../lib/Utilities';

const muteChance = 10;
const muteMinutes = [1, 2, 3, 4, 5, 10];
const rateLimit = new CoolDownManager(1000);
rateLimit.add('RNG_ICD', 1000);
@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'RNG Mute Autoresponse',
})
export default class RNGMuteResponse extends Listener<typeof Events.MessageCreate> {
  static RNGQuotes = [
    '...',
    '*A new test subject...<insert evil laughter music>*',
    '*First time?*',
    '*You dare challenge me Mere Mortal?*',
    'Did you forget that you have copium amounts of RNG luck?',
    'Did you know that there is 1 second cool down on the chance of triggering mute?',
    'Did you know that there is 2 layers of RNG to get muted?\n\nFirst layer is about getting muted, Second layer is about getting max possible mute duration',
    'Give up already *sigh*',
    'Gotta say you are still trying!',
    'Here to get muted?',
    'Just give up',
    'Looks like today is not your lucky day.',
    'RNG is bad *you know*',
    'WOAH!',
    `<@&${ROLE_IDS.OTHERS.ARCHONS}> get muted ${EMOJIS.PepeKekPoint} except this guy ${EMOJIS.BoreasKek}`,
    `<@&${ROLE_IDS.OTHERS.ARCHONS}> this guy is trying to get muted, stop them!`,
    `Did you know that mute chance is ${muteChance}%?`,
    `Did you know that this list ${muteMinutes} contains mute duration?`,
    `Nice try ${EMOJIS.LumineNice}`,
    `You are gonna need unfathomable amount of RNG Luck ${EMOJIS.smh}`,
    EMOJIS.BoreasKek,
    EMOJIS.PepeKekPoint,
    EMOJIS.smh,
    '*Never gonna give you up*',
    '*Never gonna let you down*',
    '*Never gonna run around and desert you*',
    '*Never gonna make you cry*',
    '*Never gonna say goodbye*',
    '*Never gonna tell a lie and hurt you*',
    '<https://youtu.be/QMW4AqbuSGg>',
    '*Never gonna give you mute*',
    '*Never gonna let you speak*',
    '*Never gonna run around and mute you*',
    '*Never gonna make you speak*',
    '*Never gonna say "muted"*',
    '*Never gonna tell a lie and mute you*',
  ]
    .concat(QuotesManager.getQuotes('RNGMuteQuotes'))
    .flat();

  static RNGMuteReasons = ['Spoke the forbidden word ||leak||']
    .concat(QuotesManager.getQuotes('RNGMuteReasons'))
    .flat();

  public run(message: Message) {
    if (message.channelId !== ChannelIds.RNG_MUTE) {
      return;
    }

    if (message.author.bot) {
      return;
    }
    try {
      const isLimited = rateLimit.check('RNG_ICD');
      if (isLimited < 1) {
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
              duration: pickRandom(muteMinutes) * 1000 * 60,
              member: message.member!,
              reason: pickRandom(RNGMuteResponse.RNGMuteReasons),
            });
            rateLimit.add('RNG_ICD', 3000);
          })
          .catch(container.logger.debug);
      }
    } catch (e) {
      container.logger.debug(e);
    }
  }
}
