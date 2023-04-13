import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import { ActionRowBuilder, APIEmbed, ButtonBuilder, ButtonStyle, ForumChannel } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import EnvConfig from '../../lib/EnvConfig';
import db from '../../lib/Firestore';
import type { ELEMENTS } from '../../typeDefs/typeDefs';
import { RELEASED_ELEMENTS } from '../lib/Constants';
import HallOfFameCache from '../lib/HallOfFameCache';
import { crownProps } from '../lib/Utilities';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'HoFPublish',
  name: 'Hall of Fame Publisher',
})
export default class HoFPublish extends Listener {
  HallOfFameForum: ForumChannel | undefined;

  static dashLine = '-------------------------------------';

  public async run() {
    const forumDB = await db
      .collection('hall-of-fame-config')
      .doc('channel')
      .get()
      .then((docSnap) => docSnap.data());

    if (!forumDB) {
      throw new Error('Cannot fetch Forum channel for Hall Of Fame');
    }

    const tvmGuild = await this.container.client.guilds.fetch(EnvConfig.guildId);

    const forumChannel = await tvmGuild.channels.fetch(forumDB.forumId as string);

    if (!(forumChannel instanceof ForumChannel)) {
      throw new Error('Could not obtain text forum channel');
    }

    this.HallOfFameForum = forumChannel;

    await sequentialPromises(RELEASED_ELEMENTS, this.publish);
  }

  public async publish(element: ELEMENTS) {
    if (!this.HallOfFameForum) {
      throw new Error('Hall of Fame forum channel is undefined, please fetch');
    }
    const isUnaligned = () => element === 'unaligned';
    const oneCrownEmbeds = await HallOfFameCache.generateEmbeds(element, 1);

    const twoCrownEmbeds = isUnaligned()
      ? undefined
      : await HallOfFameCache.generateEmbeds(element, 2);

    const threeCrownEmbeds = isUnaligned()
      ? undefined
      : await HallOfFameCache.generateEmbeds(element, 3);

    const currentDate = new Date();
    const props = crownProps(element);
    const thread = await this.HallOfFameForum.threads.create({
      name: `${props.plural} as of ${currentDate.toUTCString()} `,
      message: {
        content: `${props.description}`,
      },
    });

    const insertDashLine = async () =>
      thread.send({
        content: HoFPublish.dashLine,
      });

    const insertEmbeds = async (embeds: APIEmbed[]) =>
      thread.send({
        embeds,
      });

    await insertDashLine();
    const firstMsg = await insertEmbeds(oneCrownEmbeds);

    if (twoCrownEmbeds) {
      await insertDashLine();
      await insertEmbeds(twoCrownEmbeds);
    }

    if (threeCrownEmbeds) {
      await insertDashLine();
      await insertEmbeds(threeCrownEmbeds);
    }

    await thread.send({
      content: HoFPublish.dashLine,
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              label: 'Back to first place',
              style: ButtonStyle.Link,
              emoji: '⬆',
              url: firstMsg.url,
            }),
          ],
        }),
      ],
    });

    container.logger.info(`Hall of fame for Element: ${element} sent!`);
  }
}
