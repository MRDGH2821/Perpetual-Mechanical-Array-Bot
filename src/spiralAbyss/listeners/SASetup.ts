import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { ForumChannel } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'SASetup',
  name: 'Spiral Abyss Channel Setup',
})
export default class SASetup extends Listener {
  public async run(forumChannel: ForumChannel) {
    const { logger } = container;
    logger.debug(`Got ${forumChannel}`);

    await db
      .collection('spiral-abyss-config')
      .doc('channel')
      .set(
        { forumId: forumChannel.id },
        {
          merge: true,
        },
      )
      .then(() => {
        logger.debug('Forum channel registered in database for Spiral Abyss');
      })
      .catch(logger.error);
  }
}
