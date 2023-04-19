import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ForumChannel,
  type APIEmbed,
} from 'discord.js';
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
  static dashLine = '-------------------------------------';

  public async run() {
    async function publish(element: ELEMENTS, HallOfFameForum: ForumChannel) {
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
      const thread = await HallOfFameForum.threads.create({
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

      container.logger.info(`Hall of fame for Element: ${element} sent!`);
      return thread.send({
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
    }

    await db
      .collection('hall-of-fame-config')
      .doc('channel')
      .get()
      .then(async (docSnap) => {
        const forumDB = docSnap.data();

        if (!forumDB) {
          throw new Error('Cannot fetch Forum channel for Hall Of Fame');
        }

        const tvmGuild = await this.container.client.guilds.fetch(EnvConfig.guildId);
        return tvmGuild.channels.fetch(forumDB.forumId as string);
      })
      .then(async (forumChannel) => {
        if (!(forumChannel instanceof ForumChannel)) {
          throw new Error('Could not obtain text forum channel');
        }

        const publisher = (element: ELEMENTS) => publish(element, forumChannel);

        await sequentialPromises(RELEASED_ELEMENTS, publisher);
      });
    // .catch(container.logger.error);
  }
}
