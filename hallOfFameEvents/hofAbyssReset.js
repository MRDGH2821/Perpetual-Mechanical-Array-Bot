/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-unused-vars
import { Client, Event, MessageEmbed } from "@ruinguard/core";
import { EmbedColor } from "../lib/constants.js";
import { db } from "../lib/firebase.cjs";

export default new Event({
  event: "hofAbyssReset",

  /**
   * @async
   * @function run
   * @param {Client} client
   * @param {Object} resetOptions
   * @param {Date} resetOptions.cycleStartDate
   */
  async run(client, { cycleStartDate }) {
    console.log("Resetting Abyss");
    const abyssLeaderboard = new MessageEmbed()
        .setTitle("Spiral Abyss Cycle - <>")
        .setDescription("These are the travelers who have cleared the abyss")
        .setColor(EmbedColor),
      datHook = (
        await db.collection("hall-of-fame").doc("webhook")
          .get()
      ).data(),
      spiralData = (await db.collection("current-spiral-abyss").get()).docs,
      webhook = await client.channels.fetch("803488949254225960");

    /* await client.fetchWebhook(datHook.webhookID);
       console.log(spiralData[0].data()); */

    let abyssClearOnly = "",
      abyssClearTraveler = "";

    for (const entry of spiralData) {
      const entryData = await entry.data(),
        user = await client.users.fetch(entryData.userID);
      if (entryData.withTraveler) {
        abyssClearTraveler = `${abyssClearTraveler}\n${user} ${user.tag}`;
      }
      else {
        abyssClearOnly = `${abyssClearOnly}\n${user} ${user.tag}`;
      }
    }

    abyssLeaderboard.addFields([
      {
        name: "**Cleared with Traveler!**",
        value: `${abyssClearTraveler}\n-`
      },
      {
        name: "**Cleared the Spiral Abyss**",
        value: `${abyssClearOnly}\n-`
      }
    ]);

    webhook.send({
      embeds: [abyssLeaderboard]
    });
  }
});
