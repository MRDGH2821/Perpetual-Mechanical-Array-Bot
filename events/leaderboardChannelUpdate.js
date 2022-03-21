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
      hookName = "Damage Leaderboard",
      myBotWebhooks = guildWebhooks.filter((webhook) => webhook.owner.id === channel.client.user.id);
    myBotWebhooks.forEach((webhook) => {
      if (webhook.name === hookName) {
        webhook.delete();
      }
    });

    // eslint-disable-next-line one-var
    const leaderboardHook = await channel.createWebhook(hookName, {
      avatar:
      "https://cdn.discordapp.com/attachments/825749528275189760/954657244157452348/250.png",
      reason: "Leaderboard channel changed"
    });
    channel.client.emit("leaderboardSend", leaderboardHook);
  }
});
