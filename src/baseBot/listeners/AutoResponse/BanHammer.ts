import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { pickRandom } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import QuotesManager from '../../lib/QuotesManager';

@ApplyOptions<ListenerOptions>({
  enabled: true,
  event: Events.MessageCreate,
  name: 'Ban Hammer',
})
export default class BanHammerResponse extends Listener<typeof Events.MessageCreate> {
  static Quote = () =>
    pickRandom(
      ['Who are we banning today? :smirk:']
        .concat(QuotesManager.getQuotes('banHammerReasons'))
        .flat(),
    );

  public run(message: Message) {
    const { content } = message;

    if (
      /b+a+n+h+a+m+m+e+r{1,}/gimu.test(content) &&
      message.member?.permissions.has('BanMembers')
    ) {
      message.reply({
        content: BanHammerResponse.Quote(),
      });
    }
  }
}
