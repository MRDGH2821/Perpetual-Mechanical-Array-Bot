import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { Message, userMention } from 'discord.js';
import CoolDownManager from '../../../lib/CoolDownManager';
import { checkBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Baguette_ICD', 3000);
@ApplyOptions<ListenerOptions>({
  enabled: checkBoolean(process.env.AUTORESPONSE_FBI),
  event: Events.MessageCreate,
  name: 'LTF Autoresponse',
})
export default class BaguetteResponse extends Listener<typeof Events.MessageCreate> {
  private static LTF = userMention('476219631539847188');

  public run(message: Message) {
    const { content } = message;
    console.debug(content);

    if (message.channelId === '840268374621945906') {
      console.debug('Skipping TC chat');
      return;
    }

    if (!content.toLowerCase().includes('baguette')) {
      console.debug('Skipping a non baguette msg');
      return;
    }

    if (message.author.bot) {
      console.debug('Skipping bot msg');
      return;
    }
    try {
      const isLimited = rateLimit.check('Baguette_ICD');
      if (isLimited < 1 || isLimited === false) {
        const { channel } = message;
        channel
          .send({
            content: BaguetteResponse.LTF,
          })
          .then(() => {
            rateLimit.add('Baguette_ICD', 3000);
          })
          .catch(console.debug);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
