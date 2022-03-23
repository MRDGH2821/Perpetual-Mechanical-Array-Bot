/* eslint-disable sort-vars */
// eslint-disable-next-line no-unused-vars
import { Client } from "discord.js";
import { Event } from "@ruinguard/core";
import { db } from "../lib/firebase.cjs";
import { hallOfFameGenerate } from "../lib/HallOfFameManager.js";
export default new Event({
  event: "hofUpdate",

  /**
   * updates Hall of fame embeds with new data
   * @async
   * @function run
   * @param {Client} client - client object
   */
  async run(client) {
    console.log("Starting Hall Of Fame update");

    const anemoCrownBoard = await hallOfFameGenerate(client, "anemo-crown"),
      geoCrownBoard = await hallOfFameGenerate(client, "geo-crown"),
      electroCrownBoard = await hallOfFameGenerate(client, "electro-crown"),
      unalignedCrownBoard = await hallOfFameGenerate(client, "unaligned-crown"),
      currentAbyssBoard = await hallOfFameGenerate(
        client,
        "current-spiral-abyss"
      ),
      spiralAbyssboard = await hallOfFameGenerate(client, "spiral-abyss-once"),
      hallOfFameDB = await db.collection("hall-of-fame"),
      anemoMsg = await (await hallOfFameDB.doc("anemo-crown").get()).data(),
      geoMsg = await (await hallOfFameDB.doc("geo-crown").get()).data(),
      electroMsg = await (await hallOfFameDB.doc("electro-crown").get()).data(),
      unalignedMsg = await (
        await hallOfFameDB.doc("unaligned-crown").get()
      ).data(),
      currentAbyssMsg = await (
        await hallOfFameDB.doc("current-spiral-abyss").get()
      ).data(),
      spiralAbyssMsg = await (
        await hallOfFameDB.doc("spiral-abyss-once").get()
      ).data(),
      webhookMsg = await (await hallOfFameDB.doc("webhook").get()).data(),
      hofHook = await client.fetchWebhook(webhookMsg.webhookID);

    hofHook.editMessage(anemoMsg.messageID, {
      embeds: [anemoCrownBoard]
    });

    hofHook.editMessage(geoMsg.messageID, {
      embeds: [geoCrownBoard]
    });
    hofHook.editMessage(electroMsg.messageID, {
      embeds: [electroCrownBoard]
    });

    hofHook.editMessage(unalignedMsg.messageID, {
      embeds: [unalignedCrownBoard]
    });

    hofHook.editMessage(spiralAbyssMsg.messageID, {
      embeds: [spiralAbyssboard]
    });

    hofHook.editMessage(currentAbyssMsg.messageID, {
      embeds: [currentAbyssBoard]
    });
    console.log("Hall Of Fame embeds updated!");
  }
});
