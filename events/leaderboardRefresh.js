/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-unused-vars
import { Client, Collection } from 'discord.js';
import { Event } from '@ruinguard/core';
import { leaderboardData } from '../lib/LeaderboardManager.js';

export default new Event({
  event: 'leaderboardRefresh',

  /**
   * refreshes leaderboard cache data
   * @async
   * @function run
   * @param {Client} client
   */
  async run(client) {
    console.log('Leaderboard Refresh initiated');
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

    console.log('Anemo refresh');

    console.log('Anemo Open Start');
    for (const data of await leaderboardData('anemo-dmg-skill', 'open')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.skill.open.set(data.userID, dataToPut);
    }
    console.log('Anemo Open Done');

    console.log('Anemo Solo Start');
    for (const data of await leaderboardData('anemo-dmg-skill', 'solo')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.skill.solo.set(data.userID, dataToPut);
    }
    console.log('Anemo Solo Done');

    console.log('Geo Refresh');

    console.log('Geo Solo Start');
    for (const data of await leaderboardData('geo-dmg-skill', 'solo')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.skill.solo.set(data.userID, dataToPut);
    }
    console.log('Geo Solo End');

    console.log('Geo Open Start');
    for (const data of await leaderboardData('geo-dmg-skill', 'open')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.skill.open.set(data.userID, dataToPut);
    }
    console.log('Geo Solo End');

    console.log('Electro Refresh');

    console.log('Electro Open Start');
    for (const data of await leaderboardData('electro-dmg-skill', 'open')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.skill.open.set(data.userID, dataToPut);
    }
    console.log('Electro Open End');

    console.log('Electro Solo Start');
    for (const data of await leaderboardData('electro-dmg-skill', 'solo')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.skill.solo.set(data.userID, dataToPut);
    }
    console.log('Electro Solo end');

    console.log('Universal n5 refresh');

    console.log('Universal Open Start');
    for (const data of await leaderboardData('uni-dmg-n5', 'open')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.universal.n5.open.set(data.userID, dataToPut);
    }
    console.log('Universal Open End');

    console.log('Universal Solo Start');
    for (const data of await leaderboardData('uni-dmg-n5', 'solo')) {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.universal.n5.solo.set(data.userID, dataToPut);
    }
    console.log('Universal Solo End');

    console.log('Leaderboard refresh complete');
    setTimeout(() => {
      console.log('Sending leaderboard update request');
      client.emit('leaderboardUpdate', client);
      // eslint-disable-next-line no-magic-numbers
    }, 1000 * 60 * 5);
  }
});
