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
import type { ELEMENTS } from "../../typeDefs/typeDefs.js";
import { RELEASED_ELEMENTS } from "../lib/Constants.js";
import HallOfFameCache from "../lib/HallOfFameCache.js";
import { crownProps } from "../lib/Utilities.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: "HoFPublish",
  name: "Hall of Fame Publisher",
})
export default class HoFPublish extends Listener {
  static dashLine = "-------------------------------------";

  public async publish(element: ELEMENTS, HallOfFameForum: ForumChannel) {
    const isUnaligned = () => element === "unaligned";
    const oneCrownEmbeds = await HallOfFameCache.generateEmbeds(element, 1);

    const twoCrownEmbeds = isUnaligned()
      ? undefined
      : await HallOfFameCache.generateEmbeds(element, 2);

    const threeCrownEmbeds = isUnaligned()
      ? undefined
      : await HallOfFameCache.generateEmbeds(element, 3);

    const currentDate = new Date();
    const props = crownProps(element);

    const iconPic = Buffer.from(await (await fetch(props.icon)).arrayBuffer());
    const thread = await HallOfFameForum.threads.create({
      name: `${props.plural} as of ${currentDate.toUTCString()} `,
      message: {
        content: `${props.description}`,
        files: [
          {
            attachment: iconPic,
            name: "Icon.png",
          },
        ],
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

    this.container.logger.info(`Hall of fame for Element: ${element} sent!`);
    return thread.send({
      content: HoFPublish.dashLine,
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
      .collection("hall-of-fame-config")
      .doc("channel")
      .get()
      .then(async (docSnap) => {
        const forumDB = docSnap.data();

        if (!forumDB) {
          throw new Error("Cannot fetch Forum channel for Hall Of Fame");
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

        const publisher = async (element: ELEMENTS) =>
          this.publish(element, forumChannel);

        return sequentialPromises(RELEASED_ELEMENTS, publisher);
      });
    // .catch(container.logger.error);
  }
}
