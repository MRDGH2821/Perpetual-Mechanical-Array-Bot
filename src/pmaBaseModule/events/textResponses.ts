import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, EMOJIS } from '../../lib/Constants';
import CoolDownManager from '../../lib/CoolDownManager';
import { freezeMuteUser, randomArrPick } from '../../lib/Utilities';

const textResponseCD = new CoolDownManager(3000);

textResponseCD.add('FBI_ICD', 0);
textResponseCD.add('TikTok_ICD', 0);
textResponseCD.add('Leaks_ICD', 0);

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
    if (
      (fbiICD < 1 || fbiICD === false)
      && /fbi/gimu.test(msg)
      && process.env.AUTORESPONSE_FBI !== 'false'
    ) {
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
    if (
      (tikTokICD < 1 || tikTokICD === false)
      && /TikTok/gimu.test(msg)
      && process.env.AUTORESPONSE_TIKTOK !== 'false'
    ) {
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

    const leaksICD = await textResponseCD.check('Leaks_ICD');
    if (
      (leaksICD < 1 || leaksICD === false)
      && /l+e+a+k+s*/gimu.test(msg)
      && message.channelId === ChannelIds.LEAKS_DISCUSSION
      && process.env.AUTORESPONSE_LEAKS !== 'false'
    ) {
      const leakQuotes = [
        '*Why need leaks when you can have patches*\nhttps://tenor.com/view/leak-leaks-flex-seal-flex-seal-gif-15158221',
        'You are asking for leaks?',
        'The leaks are hiding from the leaker hunt decree',
        `Just wait for next version/livestream${EMOJIS.smh}`,
        EMOJIS.Copium,
        EMOJIS.LumineCopium,
        EMOJIS.LuminePyramid,
      ];

      message.reply({
        content: randomArrPick(leakQuotes),
      });
      freezeMuteUser(
        message.member!,
        message.channel!,
        15,
        1000 * 60,
        'Spoke the forbidden word - ||leak||',
      );
      textResponseCD.add('Leaks_ICD', 18000);
    }

    if (/y+o+y+o+v+e+r+s+e+/.test(msg) && process.env.AUTORESPONSE_YOYOVERSE !== 'false') {
      const yoyoQuotes = [
        `Did somebody mention Yoyoverse? ${EMOJIS.LumineWoke}\nIts CEO is <@476219631539847188>`,
        `Someone's showing interest in Yoyoverse <@476219631539847188>, maybe Hire them? ${EMOJIS.PaimonThink}`,
        'You might wanna take a look here <@476219631539847188>',
      ];
      message.channel?.createMessage({
        content: randomArrPick(yoyoQuotes),
      });
    }
  },
});
