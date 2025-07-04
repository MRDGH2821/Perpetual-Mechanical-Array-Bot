import { ApplyOptions } from "@sapphire/decorators";
import { container, Listener, type ListenerOptions } from "@sapphire/framework";
import { time } from "discord.js";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import { ChannelIds } from "../../lib/Constants.js";
import SpiralAbyssCache from "../lib/SpiralAbyssCache.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: "SABackup",
  name: "Spiral Abyss Roles Backup maker",
})
export default class SABackup extends Listener {
  public async run() {
    await SpiralAbyssCache.prepareCache();

    const backup = SpiralAbyssCache.exportCacheBackup();

    const date = new Date();

    const channel = await container.client.channels.fetch(ChannelIds.ARCHIVES);

    if (!channel?.isTextBased()) {
      throw new Error(
        "Need Text based channel to send Spiral Abyss Cache Backup",
      );
    }

    channel.send({
      content: `Backup made on ${time(date, "F")} (${time(date, "R")})`,
      files: [
        {
          attachment: Buffer.from(JSON.stringify(backup)),
          name: `SPiral Abyss Members ${date.toUTCString()}_.json`,
        },
      ],
    });
  }
}
