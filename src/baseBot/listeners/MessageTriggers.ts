import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, container, type ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
  name: 'MessageTriggers',
  enabled: false,
  emitter: container.client,
})
export default class MessageTriggers extends Listener<typeof Events.MessageCreate> {
  public run(message: Message) {
    container.logger.debug('Got message:', message);
  }

  public override onLoad() {
    container.logger.debug(this.name, 'Loaded!');
  }
}
