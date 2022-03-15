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
  run(client) {
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
    // const TVMmains = await client.guilds.fetch('803424731474034709');

    console.log('Anemo refresh');
    leaderboardData('anemo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.skill.open.set(data.userID, dataToPut);
    }));

    leaderboardData('anemo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.skill.solo.set(data.userID, dataToPut);
    }));

    console.log('Geo Refresh');
    leaderboardData('geo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.skill.solo.set(data.userID, dataToPut);
    }));
    leaderboardData('geo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.skill.open.set(data.userID, dataToPut);
    }));

    console.log('Electro Refresh');
    leaderboardData('electro-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.skill.open.set(data.userID, dataToPut);
    }));

    leaderboardData('electro-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.skill.solo.set(data.userID, dataToPut);
    }));

    console.log('Universal n5 refresh');
    leaderboardData('uni-dmg-n5', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.universal.n5.open.set(data.userID, dataToPut);
    }));

    leaderboardData('uni-dmg-n5', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.universal.n5.solo.set(data.userID, dataToPut);
    }));
    console.log('Leaderboard refresh complete');
    setTimeout(() => {
      console.log('Sending leaderboard update request');
      client.emit('leaderboardUpdate', client);
    }, 1000 * 60 * 5);
  }
});
