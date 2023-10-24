import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type ListenerOptions } from '@sapphire/framework';
import {
  ButtonStyle, ComponentType, ForumChannel, type APIEmbed,
} from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import EnvConfig from '../../lib/EnvConfig';
import db from '../../lib/Firestore';
import { VALID_ABYSS_CLEAR_TYPES } from '../lib/Constants';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';
import { SAProps } from '../lib/Utilities';
import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'SAPublish',
  name: 'Spiral Abyss Publisher',
})
export default class SAPublish extends Listener {
  static dashLine = '-------------------------------------';

  public async publish(clearType: SpiralAbyssClearTypes, SpiralAbyssForum: ForumChannel) {
    const clearEmbeds = await SpiralAbyssCache.generateEmbeds(clearType);

    const currentDate = new Date();
    const props = SAProps(clearType);
    const thread = await SpiralAbyssForum.threads.create({
      name: `${props.name}s as of ${currentDate.toUTCString()} `,
      message: {
        content: `${props.description}`,
      },
    });

    const insertDashLine = async () => thread.send({
      content: SAPublish.dashLine,
    });

    const insertEmbeds = async (embeds: APIEmbed[]) => thread.send({
      embeds,
    });

    await insertDashLine();
    const firstMsg = await insertEmbeds(clearEmbeds);

    this.container.logger.info(`${props.name} embeds sent!`);
    return thread.send({
      content: SAPublish.dashLine,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'Back to first place',
              style: ButtonStyle.Link,
              emoji: '⬆',
              url: firstMsg.url,
            },
          ],
        },
      ],
    });
  }

  public async run() {
    await db
      .collection('spiral-abyss-config')
      .doc('channel')
      .get()
      .then(async (docSnap) => {
        const forumDB = docSnap.data();

        if (!forumDB) {
          throw new Error('Cannot fetch Forum channel for Spiral Abyss');
        }

        const tvmGuild = await this.container.client.guilds.fetch(EnvConfig.guildId);
        return tvmGuild.channels.fetch(forumDB.forumId as string);
      })
      .then(async (forumChannel) => {
        if (!(forumChannel instanceof ForumChannel)) {
          throw new Error('Could not obtain text forum channel');
        }

        const publisher = (clrType: SpiralAbyssClearTypes) => this.publish(clrType, forumChannel);

        await sequentialPromises(VALID_ABYSS_CLEAR_TYPES, publisher);
      });
    // .catch(container.logger.error);
  }
}
