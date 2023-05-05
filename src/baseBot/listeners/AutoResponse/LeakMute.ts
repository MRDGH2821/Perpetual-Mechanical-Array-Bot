import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message, TextChannel } from 'discord.js';
import { ChannelIds, EMOJIS } from '../../../lib/Constants';
import CoolDownManager from '../../../lib/CoolDownManager';
import QuotesManager from '../../lib/QuotesManager';
import { freezeMuteUser, parseBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Leaks_ICD', 3000);

const muteChance = 15;

const isEnabled = () => parseBoolean(process.env.AUTORESPONSE_LEAKS);

@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'Leak Mute Autoresponse',
})
export default class LeakMuteResponse extends Listener<typeof Events.MessageCreate> {
  static Quote = () =>
    pickRandom(
      [
        '*Say that once again, I dare you.*',
        '*Why need leaks when you can have patches*\nhttps://tenor.com/view/leak-leaks-flex-seal-flex-seal-gif-15158221',
        '*Why need leaks, when you can become beta tester?*',
        'amber top is good site and so is honey hunter for leaks',
        'Check Pins',
        'Did you know that for triggering mute, there is a cool down of 18000 milliseconds?',
        'Did you know that the mute duration is 1 min (if you get lucky)?',
        'Give up already',
        'Leaks were being transmitted via satellite, but coronal mas ejection destroyed those satellites!!!',
        'Leaks were coming by carrier plane, but the plane got destroyed!!!',
        'Leaks were stolen. You gotta steal them back!',
        'Need leaks?\n\nLearn how to do Data mining',
        'The leaks are hiding from the leaker hunt decree',
        'The leaks for that were coming via submarine, but that drowned, ran out of fuel & oxygen!!!',
        'The leaks were coming via a package, but it got stolen',
        'The leaks were coming via train, but a meteorite destroyed them',
        'The real leaks were the friends we made along the way',
        'There are some uncles here, which do not give leaks',
        'You are asking for leaks?',
        "Don't ask here, ask somewhere else for leaks",
        "Leaks are leaks even if fake, which some people don't understand",
        `Did you know that mentioning the forbidden word (||leaks||) has ${muteChance}% chance of muting you?`,
        `Go to <#${ChannelIds.RNG_MUTE}> if you wanna get muted, there's 2 layers of RNG to beat`,
        `Just wait for next version/livestream${EMOJIS.smh}`,
        `Leaks were gonna come via courier. \nI heard his van crashed & he himself got hospitalised ${EMOJIS.Aether_Pain1}`,
        `No leak mute for you ${EMOJIS.PepeKekPoint}`,
        EMOJIS.Copium,
        EMOJIS.iLumineati + EMOJIS.Pairasmol,
        EMOJIS.iLumineati,
        EMOJIS.LumineCopium,
        EMOJIS.Pairamid,
        '*Never gonna give you leaks*',
        '*Never gonna let you leak*',
        '*Never gonna run around & leak you*',
        '*Never gonna make you leak*',
        '*Never gonna say leaks*',
        '*Never gonna tell a leak & hurt you*',
        '*Never gonna give you up*',
        '*Never gonna let you down*',
        '*Never gonna run around and desert you*',
        '*Never gonna make you cry*',
        '*Never gonna say goodbye*',
        '*Never gonna tell a lie and hurt you*',
      ]
        .concat(QuotesManager.getQuotes('leakQuotes'))
        .flat(),
    );

  static Reason = () =>
    pickRandom(
      ['Spoke the forbidden word ||leak||']
        .concat(QuotesManager.getQuotes('leaksMuteReasons'))
        .flat(),
    );

  public run(message: Message) {
    const { content } = message;

    if (!isEnabled()) {
      return;
    }

    if (message.channelId !== ChannelIds.LEAKS_DISCUSSION) {
      return;
    }

    if (!content.toLowerCase().includes('leak')) {
      return;
    }

    if (message.author.bot) {
      return;
    }
    try {
      const isLimited = rateLimit.check('Leaks_ICD');
      if (isLimited < 1) {
        const { channel } = message;
        channel
          .send({
            content: LeakMuteResponse.Quote(),
          })
          .then(async () => {
            if (!channel.isTextBased()) {
              return;
            }
            await freezeMuteUser({
              chance: muteChance,
              channel: channel as TextChannel,
              duration: 1000 * 60,
              member: message.member!,
              reason: LeakMuteResponse.Reason(),
            });
            rateLimit.add('Leaks_ICD', 3000);
          })
          .catch(container.logger.debug);
      }
    } catch (e) {
      container.logger.debug(e);
    }
  }
}
