import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { ForumChannel } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'HoFSetup',
  name: 'Hall of Fame Channel Setup',
})
export default class UserEvent extends Listener {
  public run(forumChannel: ForumChannel) {}
}
