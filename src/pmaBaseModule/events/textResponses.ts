import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, EMOJIS } from '../../lib/Constants';
import CoolDownManager from '../../lib/CoolDownManager';
import { getQuotes } from '../../lib/QuotesManager';
import { freezeMuteUser, randomArrPick } from '../../lib/Utilities';

const textResponseCD = new CoolDownManager(3000);

textResponseCD.add('FBI_ICD', 0);
textResponseCD.add('TikTok_ICD', 0);
textResponseCD.add('Leaks_ICD', 0);

const muteChance = 15;

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
      const banHammerQuotes = ['Who we are banning today? :smirk:']
        .concat(getQuotes('banHammerReasons'))
        .flat();
      message.reply({
        content: randomArrPick(banHammerQuotes),
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
        '*FBI is coming*',
        '*FBI investigation commences*',
        'Rick Astley was a part of F.B.I. ||(music band)||',
      ]
        .concat(getQuotes('FBIGifs'), getQuotes('FBIQuotes'))
        .flat();

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
      ]
        .concat(getQuotes('TikTokGifs'), getQuotes('TikTokQuotes'))
        .flat();

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
        EMOJIS.iLumineati,
        EMOJIS.Pairamid,
        EMOJIS.iLumineati + EMOJIS.Pairasmol,
        `No leak mute for you ${EMOJIS.PepeKekPoint}`,
        'Give up already',
        'There are some uncles here, which do not give leaks',
        'The leaks were coming via train, but a meteorite destroyed them',
        '*Say that once again, I dare you.*',
        'The leaks were coming via a package, but it got stolen',
        "Don't ask here, ask somewhere else for leaks",
        'Need leaks?\n\nLearn how to do Data mining',
        '*Why need leaks, when you can become beta tester?*',
        'amber top is good site and so is honey hunter for leaks',
        `Did you know that mentioning the forbidden word (||leaks||) has ${muteChance}% chance of muting you?`,
        'Did you know that the mute duration is 1 min (if you get lucky)?',
        'Did you know that for triggering mute, there is a cool down of 18000 milliseconds?',
        `Go to <#${ChannelIds.RNG_MUTE}> if you wanna get muted, there's 2 layers of RNG to beat`,
        'The real leaks were the friends we made along the way',
        `Leaks were gonna come via courier. \nI heard his van crashed & he himself got hospitalised ${EMOJIS.Aether_Pain1}`,
        'Leaks were being transmitted via satellite, but coronal mas ejection destroyed those satellites!!!',
        'The leaks for that were coming via submarine, but that drowned, ran out of fuel & oxygen!!!',
        'Leaks were coming by carrier plane, but the plane got destroyed!!!',
        'Leaks were stolen. You gotta steal them back!',
        "Leaks are leaks even if fake, which some people don't understand",
        'Check Pins',
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
        .concat(getQuotes('leakQuotes'))
        .flat();
      const leakMuteReasons = ['Spoke the forbidden word - ||leak||']
        .concat(getQuotes('leaksMuteReasons'))
        .flat();
      message.reply({
        content: randomArrPick(leakQuotes),
      });
      freezeMuteUser(
        message.member!,
        message.channel!,
        muteChance,
        1000 * 60,
        randomArrPick(leakMuteReasons),
      );
      textResponseCD.add('Leaks_ICD', 18000);
    }

    if (/y+o+y+o+v+e+r+s+e+/.test(msg) && process.env.AUTORESPONSE_YOYOVERSE !== 'false') {
      const yoyoQuotes = [
        `Did somebody mention Yoyoverse? ${EMOJIS.LumineWoke}\nIts CEO is <@476219631539847188>`,
        `Someone's showing interest in Yoyoverse <@476219631539847188>, maybe Hire them? ${EMOJIS.PaimonThink}`,
        'You might wanna take a look here <@476219631539847188>',
        'Did you know that saying yoyoverse pings <@476219631539847188>?',
      ]
        .concat(getQuotes('yoyoverseQuotes'))
        .flat();
      message.channel?.createMessage({
        content: randomArrPick(yoyoQuotes),
      });
    }
  },
});
