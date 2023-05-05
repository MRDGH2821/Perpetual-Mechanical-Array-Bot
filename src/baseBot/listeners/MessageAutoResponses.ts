import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { pickRandom } from '@sapphire/utilities';
import { userMention, type Message } from 'discord.js';
import { setTimeout } from 'timers/promises';
import CoolDownManager from '../../lib/CoolDownManager';
import QuotesManager from '../lib/QuotesManager';
import { parseBoolean } from '../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Baguette_ICD', 3000);
rateLimit.add('FBI_ICD', 3000);
rateLimit.add('TikTok_ICD', 3000);
rateLimit.add('Yoyoverse_ICD', 3000);

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
  name: 'MessageAutoResponses',
  enabled: true,
})
export default class MessageAutoResponses extends Listener<typeof Events.MessageCreate> {
  static Triggers: {
    condition(message: Message): boolean;
    action(message: Message): PromiseLike<void | any>;
    updateRateLimit?: () => void;
  }[] = [
      {
        condition(message) {
          return (
            parseBoolean(process.env.AUTORESPONSE_BAGUETTE) &&
          message.content.toLowerCase().includes('baguette') &&
          rateLimit.check('Baguette_ICD') < 1
          );
        },
        action: (message) =>
          message.channel.send({
            content: userMention('823564960671072336'),
          }),
        updateRateLimit: () => rateLimit.add('Baguette_ICD', 3000),
      },
      {
        condition(message) {
          return (
            /b+a+n+h+a+m+m+e+r{1,}/gimu.test(message.content) &&
          (message.member?.permissions.has('BanMembers') || false)
          );
        },
        action(message) {
          const quote = pickRandom(
            ['Who are we banning today? :smirk:']
              .concat(QuotesManager.getQuotes('banHammerReasons'))
              .flat(),
          );
          return message.reply({
            content: quote,
          });
        },
      },
      {
        condition(message) {
          return (
            parseBoolean(process.env.AUTORESPONSE_FBI) &&
          message.content.toLowerCase().includes('fbi') &&
          rateLimit.check('FBI_ICD') < 1
          );
        },
        action(message) {
          const quote = pickRandom(
            [
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
              .flat(),
          );
          return message.channel.send({
            content: quote,
          });
        },
        updateRateLimit: () => rateLimit.add('FBI_ICD', 3000),
      },
      {
        condition(message) {
          return (
            parseBoolean(process.env.AUTORESPONSE_TIKTOK) &&
          message.content.toLowerCase().includes('tiktok') &&
          rateLimit.check('TikTok_ICD') < 1
          );
        },
        action(message) {
          const quote = pickRandom(
            [
              'Do this\n https://tenor.com/view/tiktok-tiktokbad-bad-trash-garbage-gif-21041014',
              'https://cdn.discordapp.com/attachments/803459900180004904/1005441017375367208/image0.gif',
              'https://tenor.com/view/tiktok-tiktok-cringe-watermark-tiktok-watermark-watermark-cringe-gif-22182993',
              'Somebody mentioned TikTok?!?!?!??!? \n\n*Dies of cringe*',
            ]
              .concat(QuotesManager.getQuotes('TikTokGifs'), QuotesManager.getQuotes('TikTokQuotes'))
              .flat(),
          );

          return message.channel
            .send({
              content: quote,
            })
            .then((msg) => setTimeout(5 * Time.Second).then(async () => msg.delete()))
            .catch(container.logger.debug);
        },
        updateRateLimit: () => rateLimit.add('TikTok_ICD', 3000),
      },
      {
        condition(message) {
          return (
            parseBoolean(process.env.AUTORESPONSE_YOYOVERSE) &&
          message.content.toLowerCase().includes('yoyoverse') &&
          rateLimit.check('Yoyoverse_ICD') < 1
          );
        },
        action(message) {
          const pelon = userMention('476219631539847188');
          const quote = pickRandom(
            [`Did you know that saying yoyoverse pings ${pelon}`]
              .concat(QuotesManager.getQuotes('yoyoverseQuotes'))
              .flat(),
          );
          return message.channel.send({
            content: quote,
          });
        },
        updateRateLimit: () => rateLimit.add('Yoyoverse_ICD', 3000),
      },
    ];

  public run(message: Message) {
    if (message.author.bot) {
      return;
    }

    if (message.channelId === '840268374621945906') {
      return;
    }

    MessageAutoResponses.Triggers.forEach((prop) => {
      if (prop.condition(message)) {
        prop.action(message);
      }
      if (prop.updateRateLimit) {
        prop.updateRateLimit();
      }
    });
  }
}
