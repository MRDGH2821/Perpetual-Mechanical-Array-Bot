/* eslint-disable no-await-in-loop */
/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { Client, Collection } from "discord.js";
import { crownData, spiralData } from "../lib/HallOfFameManager.js";

export default new Event({
  event: "hofRefresh",

  /**
   *
   * @param {Client} client
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

    console.log("Anemo Refresh");

    console.log("Anemo Crown Start");
    for (const data of await crownData("anemo-crown")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      if (data.crowns === 1) {
        client.hallOfFame.anemoCrown.one.set(data.userID, dataToPut);
      }
      else if (data.crowns === 2) {
        client.hallOfFame.anemoCrown.two.set(data.userID, dataToPut);
      }
      else if (data.crowns === 3) {
        client.hallOfFame.anemoCrown.three.set(data.userID, dataToPut);
      }
    }
    console.log("Anemo Crown End");

    console.log("Geo Refresh");

    console.log("Geo Crown Start");
    for (const data of await crownData("geo-crown")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      if (data.crowns === 1) {
        client.hallOfFame.geoCrown.one.set(data.userID, dataToPut);
      }
      else if (data.crowns === 2) {
        client.hallOfFame.geoCrown.two.set(data.userID, dataToPut);
      }
      else if (data.crowns === 3) {
        client.hallOfFame.geoCrown.three.set(data.userID, dataToPut);
      }
    }
    console.log("Geo Crown End");

    console.log("Electro Refresh");

    console.log("Electro Crown Start");
    for (const data of await crownData("electro-crown")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      if (data.crowns === 1) {
        client.hallOfFame.electroCrown.one.set(data.userID, dataToPut);
      }
      else if (data.crowns === 2) {
        client.hallOfFame.electroCrown.two.set(data.userID, dataToPut);
      }
      else if (data.crowns === 3) {
        client.hallOfFame.electroCrown.three.set(data.userID, dataToPut);
      }
    }
    console.log("Electro Crown End");

    console.log("Unaligned Refresh");

    console.log("Unaligned Crown Start");
    for (const data of await crownData("unaligned-crown")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };

      client.hallOfFame.unalignedCrown.one.set(data.userID, dataToPut);
    }
    console.log("Unaligned Crown End");

    console.log("Spiral Abyss Refresh");

    console.log("Spiral Abyss Once start");
    for (const data of await spiralData("spiral-abyss-once")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };

      client.hallOfFame.spiralAbyss.once.set(data.userID, dataToPut);
    }
    console.log("Spiral Abyss Once end");

    console.log("Spiral Abyss Current start");
    for (const data of await spiralData("current-spiral-abyss")) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };

      client.hallOfFame.spiralAbyss.current.set(data.userID, dataToPut);
    }
    console.log("Spiral Abyss Current end");

    console.log("Leaderboard refresh complete");
    setTimeout(() => {
      console.log("Sending Hall of fame update request");
      client.emit("hofUpdate", client);
      // eslint-disable-next-line no-magic-numbers
    }, 1000 * 60 * 5);
  }
});
