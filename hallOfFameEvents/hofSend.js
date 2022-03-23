import { Event } from "@ruinguard/core";
// eslint-disable-next-line no-unused-vars
import { Webhook } from "discord.js";
import { db } from "../lib/firebase.cjs";
import { hallOfFameGenerate } from "../lib/HallOfFameManager.js";
export default new Event({
  event: "hofSend",

  /**
   * sends initial messages of hall of fame
   * @async
   * @function run
   * @param {Webhook} webhook - webhook object
   */
  async run(webhook) {
    const anemoCrownBoard = await hallOfFameGenerate(
        webhook.client,
        "anemo-crown"
      ),
      currentAbyssBoard = await hallOfFameGenerate(
        webhook.client,
        "current-spiral-abyss"
      ),
      electroCrownBoard = await hallOfFameGenerate(
        webhook.client,
        "electro-crown"
      ),
      geoCrownBoard = await hallOfFameGenerate(webhook.client, "geo-crown"),
      spiralAbyssboard = await hallOfFameGenerate(
        webhook.client,
        "spiral-abyss-once"
      ),
      unalignedCrownBoard = await hallOfFameGenerate(
        webhook.client,
        "unaligned-crown"
      );

    await db.collection("hall-of-fame").doc("webhook")
      .set({
        webhookID: webhook.id
      });

    await db
      .collection("hall-of-fame")
      .doc("anemo-crown")
      .set({
        messageID: (await webhook.send({ embeds: [anemoCrownBoard] })).id
      });

    await db
      .collection("hall-of-fame")
      .doc("geo-crown")
      .set({
        messageID: (await webhook.send({ embeds: [geoCrownBoard] })).id
      });

    await db
      .collection("hall-of-fame")
      .doc("electro-crown")
      .set({
        messageID: (await webhook.send({ embeds: [electroCrownBoard] })).id
      });

    await db
      .collection("hall-of-fame")
      .doc("unaligned-crown")
      .set({
        messageID: (await webhook.send({ embeds: [unalignedCrownBoard] })).id
      });

    await db
      .collection("hall-of-fame")
      .doc("current-spiral-abyss")
      .set({
        messageID: (await webhook.send({ embeds: [currentAbyssBoard] })).id
      });

    await db
      .collection("hall-of-fame")
      .doc("spiral-abyss-once")
      .set({
        messageID: (await webhook.send({ embeds: [spiralAbyssboard] })).id
      });
  }
});
