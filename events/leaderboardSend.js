// eslint-disable-next-line no-unused-vars
import { MessageEmbed, Webhook } from "discord.js";
import { channelMention, hyperlink } from "@discordjs/builders";
import { Event } from "@ruinguard/core";
import { db } from "../lib/firebase.cjs";
import { leaderboardGenerate } from "../lib/LeaderboardManager.js";
import { travelerShowcase } from "../lib/channelIDs.js";

export default new Event({
  event: "leaderboardSend",

  /**
   * @async
   * @function run
   * @param {Webhook} webhook
   */
  async run(webhook) {
    const anemoSkillBoard = await leaderboardGenerate(
        webhook.client,
        "anemo-dmg-skill"
      ),
      electroSkillBoard = await leaderboardGenerate(
        webhook.client,
        "electro-dmg-skill"
      ),
      geoSkillBoard = await leaderboardGenerate(
        webhook.client,
        "geo-dmg-skill"
      ),
      information = new MessageEmbed()
        .setColor("#fffffd")
        .setTitle("**Traveler Mains Damage Leaderboards**")
        .setDescription("The Damage Leaderboards are still a WiP, we'll make an official announcement once it's relatively finished. If anyone is interested to help out, feel free to send a message.\n\n*This leaderboard is not a measurement of your traveler's power, it's mostly for fun. Just because you're not on top doesn't mean you're bad. This is an arbitrary damage per screenshot leaderboard.*\n\n**Quick FAQ**")
        .addFields([
          {
            name: "***What are the rules?***",
            value:
              "All fights must be against \"Masanori\" - the nameless samurai.\n\n> **Solo Traveler** - Must only use Traveler in the party. No resonance, food, potion, coop mode, etc.\n> **Open Category** - All the other restrictions besides Masanori being the target are lifted. Any form of buffing is allowed."
          },
          {
            name: "***How do I enter?***",
            value: `Send an image or preferably a video of your fight against "Masanori" - the nameless samurai in ${channelMention(travelerShowcase)}.
Then, you may choose to submit your entry to the ${hyperlink(
    "Entry Form",
    "https://forms.gle/PheYfWBm2hPzjLem6"
  )}. If you have duplicate entries in one category, the outdated one will eventually be removed.`
          },
          {
            name: "***Why \"Masanori\" - the nameless samurai?***",
            value: `Because he's easy to access, he's not in a domain (no slow load times), has no varying elemental resistance, and generally a bro. Dude has an **10% elemental resistance** across all elements, and **-20% physical resistance**. \n\n${hyperlink(
              "Traveler Mains Damage Leaderboard",
              "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqXd6XcMRBf4Buq4G-8wL6gg8Rn0Vfv_V1P_iz5K158nit_yt8TS6tx7oHuU433xvGIglgOaDY7gGn/pubhtml"
            )} | ${hyperlink(
              "Entry Form",
              "https://forms.gle/PheYfWBm2hPzjLem6"
            )}`
          }
        ]),
      uniN5board = await leaderboardGenerate(webhook.client, "uni-dmg-n5");
    await webhook.send({ embeds: [information] });
    await db.collection("leaderboards").doc("webhook")
      .set({
        webhookID: webhook.id
      });

    await db
      .collection("leaderboards")
      .doc("anemo-dmg-skill")
      .set({
        messageID: (await webhook.send({ embeds: [anemoSkillBoard] })).id
      });

    await db
      .collection("leaderboards")
      .doc("geo-dmg-skill")
      .set({
        messageID: (await webhook.send({ embeds: [geoSkillBoard] })).id
      });

    await db
      .collection("leaderboards")
      .doc("electro-dmg-skill")
      .set({
        messageID: (await webhook.send({ embeds: [electroSkillBoard] })).id
      });

    await db
      .collection("leaderboards")
      .doc("uni-dmg-n5")
      .set({
        messageID: (await webhook.send({ embeds: [uniN5board] })).id
      });
  }
});
