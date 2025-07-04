import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import {
  type APIEmbed,
  ButtonStyle,
  ComponentType,
  ForumChannel,
} from "discord.js";
import { sequentialPromises } from "yaspr";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import db from "../../lib/Database/Firestore.js";
import EnvConfig from "../../lib/EnvConfig.js";
import { VALID_ABYSS_CLEAR_TYPES } from "../lib/Constants.js";
import SpiralAbyssCache from "../lib/SpiralAbyssCache.js";
import { SAProps } from "../lib/Utilities.js";
import type { SpiralAbyssClearTypes } from "../typeDefs/spiralAbyssTypes.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: "SAPublish",
  name: "Spiral Abyss Publisher",
})
export default class SAPublish extends Listener {
  public static dashLine = "-------------------------------------";

  public async publish(
    clearType: SpiralAbyssClearTypes,
    SpiralAbyssForum: ForumChannel,
  ) {
    const clearEmbeds = await SpiralAbyssCache.generateEmbeds(clearType);

    const currentDate = new Date();
    const props = SAProps(clearType);
    const thread = await SpiralAbyssForum.threads.create({
      name: `${props.name}s as of ${currentDate.toUTCString()} `,
      message: {
        content: `${props.description}`,
      },
    });

    const insertDashLine = async () =>
      thread.send({
        content: SAPublish.dashLine,
      });

    const insertEmbeds = async (embeds: APIEmbed[]) =>
      thread.send({
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
              label: "Back to first place",
              style: ButtonStyle.Link,
              emoji: "⬆",
              url: firstMsg.url,
            },
          ],
        },
      ],
    });
  }

  public async run() {
    await db
      .collection("spiral-abyss-config")
      .doc("channel")
      .get()
      .then(async (docSnap) => {
        const forumDB = docSnap.data();

        if (!forumDB) {
          throw new Error("Cannot fetch Forum channel for Spiral Abyss");
        }

        const tvmGuild = await this.container.client.guilds.fetch(
          EnvConfig.guildId,
        );
        return tvmGuild.channels.fetch(forumDB.forumId as string);
      })
      .then(async (forumChannel) => {
        if (!(forumChannel instanceof ForumChannel)) {
          throw new TypeError("Could not obtain text forum channel");
        }

        const publisher = async (clrType: SpiralAbyssClearTypes) =>
          this.publish(clrType, forumChannel);

        return sequentialPromises(VALID_ABYSS_CLEAR_TYPES, publisher);
      });
    // .catch(container.logger.error);
  }
}
