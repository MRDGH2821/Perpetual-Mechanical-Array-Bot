import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../../lib/BotEvent';

export default new BotEvent({
  event: ClientEvents.MESSAGE_CREATE,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const msg = message.content;

    if (message.author.bot) {
      return;
    }

    if (/banhammer/gimu.test(msg) && message.author.id === '440081484855115776') {
      message.reply({
        content: 'Who we are banning today? :smirk:',
        reference: true,
      });
    }
  },
});
