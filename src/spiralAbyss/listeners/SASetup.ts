import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import type { ForumChannel } from "discord.js";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import db from "../../lib/Database/Firestore.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: "SASetup",
  name: "Spiral Abyss Channel Setup",
})
export default class SASetup extends Listener {
  public async run(forumChannel: ForumChannel) {
    this.container.logger.debug(`Got ${forumChannel}`);

    await db
      .collection("spiral-abyss-config")
      .doc("channel")
      .set(
        { forumId: forumChannel.id },
        {
          merge: true,
        },
      )
      .then(() =>
        this.container.logger.debug(
          "Forum channel registered in database for Spiral Abyss",
        ),
      )
      .catch((error) => this.container.logger.error(error));
  }
}
