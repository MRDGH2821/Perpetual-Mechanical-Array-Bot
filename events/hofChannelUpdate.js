import { Event } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { TextChannel } from "discord.js";

export default new Event({
  event: "hofChannelUpdate",

  /**
   * changes hall of fame channel
   * @async
   * @function run
   * @param {TextChannel} channel
   */
  async run(channel) {
    const guildWebhooks = await channel.guild.fetchWebhooks(),
      hookName = "Hall Of Fame",
      myBotWebhooks = guildWebhooks.filter((webhook) => webhook.owner.id === channel.client.user.id);
    myBotWebhooks.forEach((webhook) => {
      if (webhook.name === hookName) {
        webhook.delete();
      }
    });

    // eslint-disable-next-line one-var
    const leaderboardHook = await channel.createWebhook(hookName, {
      avatar:
        "https://static.wikia.nocookie.net/gensin-impact/images/7/74/Guild_symbol.png/revision/latest/scale-to-width-down/250?cb=20210129164048",
      reason: "Hall Of Fame channel changed"
    });
    channel.client.emit("hofSend", leaderboardHook);
  }
});
