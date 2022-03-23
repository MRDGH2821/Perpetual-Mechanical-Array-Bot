/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { Client, Collection } from "discord.js";
import { crownSetData, spiralSetData } from "../lib/utilityFunctions.js";
import { Event } from "@ruinguard/core";

export default new Event({
  event: "hofRefresh",

  /**
   * refreshes hall of fame cache
   * @async
   * @function run
   * @param {Client} client - client object
   */
  async run(client) {
    console.log("Hall of fame Refresh initiated");

    client.hallOfFame = {
      anemoCrown: {
        one: new Collection(),
        three: new Collection(),
        two: new Collection()
      },
      electroCrown: {
        one: new Collection(),
        three: new Collection(),
        two: new Collection()
      },
      geoCrown: {
        one: new Collection(),
        three: new Collection(),
        two: new Collection()
      },
      spiralAbyss: {
        current: new Collection(),
        once: new Collection()
      },
      unalignedCrown: {
        one: new Collection()
      }
    };
    await Promise.all([
      crownSetData({
        client,
        collectionObj: client.hallOfFame.anemoCrown,
        element: "anemo-crown"
      }),

      crownSetData({
        client,
        collectionObj: client.hallOfFame.geoCrown,
        element: "geo-crown"
      }),

      crownSetData({
        client,
        collectionObj: client.hallOfFame.electroCrown,
        element: "electro-crown"
      }),

      crownSetData({
        client,
        collectionObj: client.hallOfFame.unalignedCrown,
        element: "unaligned-crown"
      }),

      spiralSetData({
        client,
        collection: client.hallOfFame.spiralAbyss.current,
        type: "current-spiral-abyss"
      }),

      spiralSetData({
        client,
        collection: client.hallOfFame.spiralAbyss.once,
        type: "spiral-abyss-once"
      })
    ]).then((values) => {
      console.log(values);
      console.log("Hall Of Fame refresh complete");
      console.log("Sending Hall of fame update request");
      process.env.HALL_OF_FAME = true;
      client.emit("hofUpdate", client);
    });

    setTimeout(() => {
      // eslint-disable-next-line no-magic-numbers
    }, 1000 * 60 * 5);
  }
});
