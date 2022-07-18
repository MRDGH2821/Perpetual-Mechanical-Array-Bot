import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import CoolDownManager from '../../lib/CoolDownManager';
import { randomArrPick } from '../../lib/Utilities';

const textResponseCD = new CoolDownManager(3000);

textResponseCD.add('FBI_ICD', 0);
export default new BotEvent({
  event: ClientEvents.MESSAGE_CREATE,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const msg = message.content;

    if (message.author.bot) {
      return;
    }
    const timeLeft = await textResponseCD.check('FBI_ICD');
    // console.log({ timeLeft });

    if (/banhammer/gimu.test(msg) && message.author.id === '440081484855115776') {
      message.reply({
        content: 'Who we are banning today? :smirk:',
        reference: true,
      });
    }
    textResponseCD.add('FBI_ICD', 3000);

    if ((timeLeft < 1 || timeLeft === false) && /fbi/gimu.test(msg)) {
      const fbiQuotes = [
        'https://tenor.com/view/traffic-fbi-open-up-raid-gif-13450966',
        'Did you know FBI stands for Faraway Buddy Insideyourdevice ?',
        'https://tenor.com/view/chicken-fbi-skeptic-chicken-funny-gif-14153035',
        'https://tenor.com/view/fbi-swat-busted-police-open-up-gif-16928811',
        'https://tenor.com/view/priyam-raj-fbi-meme-fbi-open-up-fbi-gamer-gif-19628656',
        'https://tenor.com/view/dark-red-fbi-warning-gif-18254979',
        'You know what, I wonder if its actually NSA which spies or FBI :thinking:',
      ];

      message.reply({
        content: randomArrPick(fbiQuotes),
      });
    }
  },
});
