import { Event } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { TextChannel } from "discord.js";

export default new Event({
  event: "leaderboardChannelUpdate",

  /**
   * changes leaderboard channel
   * @async
   * @function run
   * @param {TextChannel} channel
   */
  async run(channel) {
    const guildWebhooks = await channel.guild.fetchWebhooks(),
      myBotWebhooks = guildWebhooks.filter((webhook) => webhook.owner.id === channel.client.user.id);
    myBotWebhooks.forEach((webhook) => webhook.delete());

    // eslint-disable-next-line one-var
    const leaderboardHook = await channel.createWebhook("Damage Leaderboard", {
      reason: "Leaderboard channel changed"
    });
    channel.client.emit("leaderboardSend", leaderboardHook);
  }
});
