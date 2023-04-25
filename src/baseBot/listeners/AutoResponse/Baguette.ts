import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import { Message, userMention } from 'discord.js';
import CoolDownManager from '../../../lib/CoolDownManager';
import { parseBoolean } from '../../lib/Utilities';

const rateLimit = new CoolDownManager(3000);
rateLimit.add('Baguette_ICD', 3000);

const isEnabled = () => parseBoolean(process.env.AUTORESPONSE_BAGUETTE);
@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'Baguette Autoresponse',
})
export default class BaguetteResponse extends Listener<typeof Events.MessageCreate> {
  private static LTF = userMention('823564960671072336');

  public run(message: Message) {
    const { content } = message;

    if (!isEnabled()) {
      return;
    }

    if (message.channelId === '840268374621945906') {
      return;
    }

    if (!content.toLowerCase().includes('baguette')) {
      return;
    }

    if (message.author.bot) {
      return;
    }
    try {
      const isLimited = rateLimit.check('Baguette_ICD');
      if (isLimited < 1) {
        const { channel } = message;
        channel
          .send({
            content: BaguetteResponse.LTF,
          })
          .then(() => {
            rateLimit.add('Baguette_ICD', 3000);
          })
          .catch(container.logger.debug);
      }
    } catch (e) {
      container.logger.debug(e);
    }
  }

  public override onLoad() {
    container.logger.debug(this.name, 'Loaded!');
  }
}
