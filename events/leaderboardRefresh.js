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
    const TVMmains = await client.guilds.fetch('803424731474034709');

    leaderboardData('anemo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.anemo.open.set(data.userID, dataToPut);
    }));

    leaderboardData('geo-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.geo.open.set(data.userID, dataToPut);
    }));

    leaderboardData('electro-dmg-skill', 'open').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.electro.open.set(data.userID, dataToPut);
    }));

    leaderboardData('anemo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.anemo.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('geo-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.geo.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('electro-dmg-skill', 'solo').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.electro.solo.set(data.userID, dataToPut);
    }));

    leaderboardData('uni-dmg-n5', 'open').then((leaderBoardData) => leaderBoardData.forEach((data) => {
      const GuildMember = TVMmains.members.fetch(data.userID),
        dataToPut = {
          GuildMember,
          data
        };
      client.leaderboards.universal.n5.set(data.userID, dataToPut);
    }));
  }
});
