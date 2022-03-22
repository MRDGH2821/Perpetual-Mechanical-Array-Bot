// eslint-disable-next-line no-unused-vars
import { Client } from "discord.js";
import { Event } from "@ruinguard/core";
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
    console.log("Starting leaderboard update.");

    const anemoCrownBoard = await hallOfFameGenerate(client, "anemo-crown"),
      geoCrownBoard = await hallOfFameGenerate(client, "geo-crown"),
      electroCrownBoard = await hallOfFameGenerate(client, "electro-crown"),
      unalignedCrownBoard = await hallOfFameGenerate(client, "unaligned-crown"),
      currentAbyssBoard = await hallOfFameGenerate(
        client,
        "current-spiral-abyss"
      ),
      spiralAbyssboard = await hallOfFameGenerate(client, "spiral-abyss-once");
  }
});
