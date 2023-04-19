import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import { ActionRowBuilder, type APIEmbed, ButtonBuilder, ButtonStyle, ForumChannel } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import EnvConfig from '../../lib/EnvConfig';
import db from '../../lib/Firestore';
import { LEADERBOARD_ELEMENTS } from '../lib/Constants';
import LeaderboardCache from '../lib/LeaderboardCache';
import { leaderboardProps } from '../lib/Utilities';
import type { LBElements } from '../typeDefs/leaderboardTypeDefs';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'LBPublish',
  name: 'Leaderboard Publisher',
})
export default class LBPublish extends Listener {
  static dashLine = '-------------------------------------';

  public async run() {
    async function publish(element: LBElements, HallOfFameForum: ForumChannel) {
      const openEmbeds = await LeaderboardCache.generateEmbeds(element, 'open');
      const soloEmbeds = await LeaderboardCache.generateEmbeds(element, 'solo');

      const currentDate = new Date();
      const props = leaderboardProps(element);
      const thread = await HallOfFameForum.threads.create({
        name: `${props.name} leaderboard as of ${currentDate.toUTCString()} `,
        message: {
          content: `${props.name}`,
        },
      });

      const insertDashLine = async () =>
        thread.send({
          content: LBPublish.dashLine,
        });

      const insertEmbeds = async (embeds: APIEmbed[]) =>
        thread.send({
          embeds,
        });

      await insertDashLine();
      const firstMsg = await insertEmbeds(openEmbeds);

      await insertDashLine();
      await insertEmbeds(soloEmbeds);

      container.logger.info(`Damage Leaderboard for Element: ${element} sent!`);
      return thread.send({
        content: LBPublish.dashLine,
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
      .collection('leaderboard-config')
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

        const publisher = (element: LBElements) => publish(element, forumChannel);

        await sequentialPromises(LEADERBOARD_ELEMENTS, publisher);
      });
    // .catch(container.logger.error);
  }
}
