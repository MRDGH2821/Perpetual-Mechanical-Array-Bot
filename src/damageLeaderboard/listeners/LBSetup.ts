import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { ForumChannel, TextChannel } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';

type LBSetupArgs = {
  forumChannel?: ForumChannel;
  textChannel?: TextChannel;
};

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'LBSetup',
  name: 'Leaderboard Channel Setup',
})
export default class LBSetup extends Listener {
  public async run(channels: LBSetupArgs) {
    const { logger } = container;
    logger.debug('Got', channels);

    await db
      .collection('leaderboard-config')
      .doc('channel')
      .set(
        { forumId: channels.forumChannel?.id, channelId: channels.textChannel?.id },
        {
          merge: true,
        },
      )
      .then(() => {
        logger.debug(`Channels registered in database for Leaderboard`);
      })
      .catch(logger.error);
  }
}
