import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import CoolDownManager from '../../lib/CoolDownManager';
import { freezeMuteUser, randomArrPick } from '../../lib/Utilities';

const textResponseCD = new CoolDownManager(3000);

textResponseCD.add('FBI_ICD', 0);
textResponseCD.add('TikTok_ICD', 0);
export default new BotEvent({
  event: ClientEvents.MESSAGE_CREATE,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const msg = message.content;

    if (message.author.bot) {
      return;
    }
    // console.log({ timeLeft });

    if (/banhammer/gimu.test(msg) && message.author.id === '440081484855115776') {
      message.reply({
        content: 'Who we are banning today? :smirk:',
        reference: true,
      });
    }

    const fbiICD = await textResponseCD.check('FBI_ICD');
    if ((fbiICD < 1 || fbiICD === false) && /fbi/gimu.test(msg)) {
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

      textResponseCD.add('FBI_ICD', 3000);
    }

    const tikTokICD = await textResponseCD.check('TikTok_ICD');
    if ((tikTokICD < 1 || tikTokICD === false) && /TikTok/gimu.test(msg)) {
      const tikTokQuotes = [
        'Somebody mentioned TikTok?!?!?!??!? \n\n*Dies of cringe*',
        'https://tenor.com/view/tiktok-tiktok-cringe-watermark-tiktok-watermark-watermark-cringe-gif-22182993',
        'Do this\n https://tenor.com/view/tiktok-tiktokbad-bad-trash-garbage-gif-21041014',
        'https://cdn.discordapp.com/attachments/803459900180004904/1005441017375367208/image0.gif',
      ];

      message
        .reply({
          content: randomArrPick(tikTokQuotes),
        })
        .then((TikTokMsg) => {
          setTimeout(() => {
            TikTokMsg.delete();
          }, 10000);
        });

      textResponseCD.add('TikTok_ICD', 10000);
    }

  },
});
