import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { getQuotes } from '../../lib/QuotesManager';

@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'BanHammer',
})
export default class BanHammerResponse extends Listener<typeof Events.MessageCreate> {
  static banHammerQuotes = ['Who are we banning today? :smirk:']
    .concat(getQuotes('banHammerReasons'))
    .flat();

  public run(message: Message) {
    const { content } = message;
    message.client.logger.debug(content);
    if (
      /b+a+n+h+a+m+m+e+r{1,}/gimu.test(content) &&
      message.member?.permissions.has('BanMembers')
    ) {
      message.reply({
        content: pickRandom(BanHammerResponse.banHammerQuotes),
      });
    }
  }
}
