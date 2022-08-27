/* jscpd:ignore-start */
import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, EMOJIS } from '../../lib/Constants';
import CoolDownManager from '../../lib/CoolDownManager';
import { getQuotes } from '../../lib/QuotesManager';
import { freezeMuteUser, randomArrPick } from '../../lib/Utilities';
/* jscpd:ignore-end */
const rngMuteICD = new CoolDownManager(1000);
rngMuteICD.add('RNG_mute_ICD', 1000);
export default new BotEvent({
  event: ClientEvents.MESSAGE_CREATE,
  on: true,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const { content } = message;
    if (message.author.bot) {
      return;
    }

    if (/\(+\)*/gimu.test(content)) {
      return;
    }

    const muteQuotes = [
      'Here to get muted?',
      '*First time?*',
      `You are gonna need unfathomable amount of RNG Luck ${EMOJIS.smh}`,
      '...',
      '*A new test subject...<insert evil laughter music>*',
    ]
      .concat(getQuotes('RNGMuteQuotes'))
      .flat();

    const currentICD = await rngMuteICD.check('RNG_mute_ICD');

    const muteMinutes = [1, 2, 3, 4, 5, 10];

    const muteDuration = randomArrPick(muteMinutes) * 1000 * 60;

    const muteReasons = [
      '*You asked for it*',
      '*You are the chosen one!*',
      'You got what you wanted',
      'I have taken away your ability to talk now',
      'They are the RNG God! Gotta mute them',
    ]
      .concat(getQuotes('RNGMuteReasons'))
      .flat();

    if (message.channelId === ChannelIds.RNG_MUTE && (currentICD < 1 || currentICD === false)) {
      message
        .reply({
          content: randomArrPick(muteQuotes),
        })
        .then(() => {
          if (!message.author.bot) {
            const selectedMuteReason = randomArrPick(muteReasons);
            freezeMuteUser(message.member!, message.channel!, 10, muteDuration, selectedMuteReason);
          }
        });

      rngMuteICD.add('RNG_mute_ICD', 1000);
    }
  },
});
