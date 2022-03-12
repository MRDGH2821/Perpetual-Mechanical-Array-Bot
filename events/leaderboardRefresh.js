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
    // f
    /**
     * @namespace {Client} client
     * @property {object} leaderboards - leaderboard object containing collections
     * @property {object} leaderboards.anemo
     * @property {object} leaderboards.geo
     * @property {object} leaderboards.electro
     * @property {object} leaderboards.universal
     * @property {object} leaderboards.anemo.skill
     * @property {object} leaderboards.geo.skill
     * @property {object} leaderboards.electro.skill
     * @property {object} leaderboards.universal.n5
     * @property {Collection<string, object>} leaderboards.anemo.skill.open
     * @property {Collection<string, object>} leaderboards.geo.skill.open
     * @property {Collection<string, object>} leaderboards.electro.skill.open
     * @property {Collection<string, object>} leaderboards.universal.n5.open
     * @property {Collection<string, object>} leaderboards.anemo.skill.solo
     * @property {Collection<string, object>} leaderboards.geo.skill.solo
     * @property {Collection<string, object>} leaderboards.electro.skill.solo
     * @property {Collection<string, object>} leaderboards.universal.n5.solo
     */
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

    leaderboardData('anemo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.open.set(data.userID, dataToPut);
    }));

    leaderboardData('geo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.open.set(data.userID, dataToPut);
    }));

    leaderboardData('electro-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.open.set(data.userID, dataToPut);
    }));

    leaderboardData('anemo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.anemo.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('geo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.geo.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('electro-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.electro.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('uni-dmg-n5', 'open').then((leaderBoardData) => leaderBoardData.forEach(async(data) => {
      const User = await client.users.fetch(data.userID),
        dataToPut = {
          User,
          data
        };
      client.leaderboards.universal.n5.set(data.userID, dataToPut);
    }));
  }
});
