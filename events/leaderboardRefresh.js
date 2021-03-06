/* eslint-disable one-var */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-unused-vars
import { Client, Collection } from "discord.js";
import { Event } from "@ruinguard/core";
import { leaderboardSetData } from "../lib/utilityFunctions.js";

export default new Event({
  event: "leaderboardRefresh",

  /**
   * refreshes leaderboard cache data
   * @async
   * @function run
   * @param {Client} client - client object
   */
  async run(client) {
    process.env.LEADERBOARD = false;
    console.log("Leaderboard Refresh initiated");
    client.leaderboards = {
      anemo: {
        skill: {
          open: new Collection(),
          solo: new Collection()
        }
      },
      electro: {
        skill: {
          open: new Collection(),
          solo: new Collection()
        }
      },
      geo: {
        skill: {
          open: new Collection(),
          solo: new Collection()
        }
      },
      universal: {
        n5: {
          open: new Collection(),
          solo: new Collection()
        }
      }
    };

    await Promise.all([
      leaderboardSetData({
        client,
        collection: client.leaderboards.anemo.skill.open,
        dmgCategory: "anemo-dmg-skill",
        type: "open"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.anemo.skill.solo,
        dmgCategory: "anemo-dmg-skill",
        type: "solo"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.geo.skill.open,
        dmgCategory: "geo-dmg-skill",
        type: "open"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.geo.skill.solo,
        dmgCategory: "geo-dmg-skill",
        type: "solo"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.electro.skill.solo,
        dmgCategory: "electro-dmg-skill",
        type: "solo"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.electro.skill.open,
        dmgCategory: "electro-dmg-skill",
        type: "open"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.universal.n5.solo,
        dmgCategory: "uni-dmg-n5",
        type: "solo"
      }),

      leaderboardSetData({
        client,
        collection: client.leaderboards.universal.n5.open,
        dmgCategory: "uni-dmg-n5",
        type: "open"
      })
    ]).then(() => {
      console.log("Leaderboard refresh complete");
      process.env.LEADERBOARD = true;
      if (process.env.NODE_ENV !== "dev") {
        console.log("Sending leaderboard update request");
        client.emit("leaderboardUpdate", client);
      }
    });
  }
});
