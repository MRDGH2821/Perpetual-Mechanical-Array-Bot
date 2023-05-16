import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { pickRandom } from '@sapphire/utilities';
import { type Message } from 'discord.js';
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
