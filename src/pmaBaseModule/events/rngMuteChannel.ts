/* jscpd:ignore-start */
import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, EMOJIS, ROLE_IDS } from '../../lib/Constants';
import CoolDownManager from '../../lib/CoolDownManager';
import { getQuotes } from '../../lib/QuotesManager';
import { freezeMuteUser, randomArrPick } from '../../lib/Utilities';
/* jscpd:ignore-end */
const rngMuteICD = new CoolDownManager(1000);
rngMuteICD.add('RNG_mute_ICD', 1000);
const muteChance = 10;

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
    const muteMinutes = [1, 2, 3, 4, 5, 10];

    const muteQuotes = [
      'Here to get muted?',
      '*First time?*',
      `You are gonna need unfathomable amount of RNG Luck ${EMOJIS.smh}`,
      '...',
      '*A new test subject...<insert evil laughter music>*',
      'Just give up',
      'Give up already *sigh*',
      `Did you know that mute chance is ${muteChance}%?`,
      'Did you know that there is 1 second cool down on the chance of triggering mute?',
      `Did you know that this list ${muteMinutes} contains mute duration?`,
      'Did you know that there is 2 layers of RNG to get muted?\n\nFirst layer is about getting muted, Second layer is about getting max possible mute duration',
      'Looks like today is not your lucky day.',
      `<@&${ROLE_IDS.OTHERS.ARCHONS}> this guy is trying to get muted, stop them!`,
      `<@&${ROLE_IDS.OTHERS.ARCHONS}> get muted ${EMOJIS.PepeKekPoint} except this guy ${EMOJIS.BoreasKek}`,
      'Did you forget that you have copium amounts of RNG luck?',
      EMOJIS.smh,
      'Gotta say you are still trying!',
      `Nice try ${EMOJIS.LumineNice}`,
      'WOAH!',
      'RNG is bad *you know*',
      '*You dare challenge me Mere Mortal?*',
      EMOJIS.BoreasKek,
      EMOJIS.PepeKekPoint,
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
      .concat(getQuotes('RNGMuteQuotes'))
      .flat();

    const currentICD = await rngMuteICD.check('RNG_mute_ICD');

    const muteDuration = randomArrPick(muteMinutes) * 1000 * 60;

    const muteReasons = [
      '*You asked for it*',
      '*You are the chosen one!*',
      'You got what you wanted',
      'I have taken away your ability to talk now',
      'They are the RNG God! Gotta mute them',
      'Congrats on getting the mute!',
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
            freezeMuteUser(
              message.member!,
              message.channel!,
              muteChance,
              muteDuration,
              selectedMuteReason,
            );
          }
        });

      rngMuteICD.add('RNG_mute_ICD', 1000);
    }
  },
});
