/* eslint-disable no-magic-numbers */
/* eslint-disable sort-vars */
import { CooldownManager, Event } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { Client } from "discord.js";
import { db } from "../lib/firebase.cjs";
import { leaderboardGenerate } from "../lib/LeaderboardManager.js";

const icd = new CooldownManager();
icd.add("leaderboardCD", 0);

export default new Event({
  event: "leaderboardUpdate",

  /**
   * updates leaderboard embeds with new data
   * @async
   * @function run
   * @param {Client} client - client object
   */
  run(client) {
    setTimeout(async() => {
      const timeLeft = await icd.check("leaderboardCD");
      console.log("Leaderboard Update ICD: ", timeLeft);

      if (timeLeft < 1 || timeLeft === false) {
        console.log("Starting leaderboard update.");

        const anemoSkillBoard = await leaderboardGenerate(
            client,
            "anemo-dmg-skill"
          ),
          electroSkillBoard = await leaderboardGenerate(
            client,
            "electro-dmg-skill"
          ),
          geoSkillBoard = await leaderboardGenerate(client, "geo-dmg-skill"),
          uniN5board = await leaderboardGenerate(client, "uni-dmg-n5"),
          leaderboardDB = await db.collection("leaderboards"),
          anemoMsg = await (
            await leaderboardDB.doc("anemo-dmg-skill").get()
          ).data(),
          geoMsg = await (
            await leaderboardDB.doc("geo-dmg-skill").get()
          ).data(),
          electroMsg = await (
            await leaderboardDB.doc("electro-dmg-skill").get()
          ).data(),
          uniMsg = await (await leaderboardDB.doc("uni-dmg-n5").get()).data(),
          webhookMsg = await (await leaderboardDB.doc("webhook").get()).data(),
          leaderboardhook = await client.fetchWebhook(webhookMsg.webhookID);

        leaderboardhook.editMessage(anemoMsg.messageID, {
          embeds: [anemoSkillBoard]
        });
        leaderboardhook.editMessage(geoMsg.messageID, {
          embeds: [geoSkillBoard]
        });
        leaderboardhook.editMessage(electroMsg.messageID, {
          embeds: [electroSkillBoard]
        });
        leaderboardhook.editMessage(uniMsg.messageID, {
          embeds: [uniN5board]
        });
        console.log("Leaderboard embeds updated!");
        await icd.add("bonkCD", 1000 * 60 * 5);
      }
      else {
        console.log(
          "Leaderboard update CD: ",
          await icd.check("leaderboardCD")
        );
      }
    }, 1000 * 60 * 5);
  }
});
