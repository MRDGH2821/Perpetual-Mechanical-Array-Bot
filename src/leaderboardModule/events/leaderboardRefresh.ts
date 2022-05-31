import { IEvent } from '@bot-types/interfaces';
import leaderboardCache from '@lib/leaderboardCache';
import { setLeaderboardData } from '@lib/leaderboardManager';
import { PMAEventHandler } from '@lib/Utilities';
import { RestClient } from 'detritus-client/lib/rest';

const leaderboardRefresh: IEvent = {
  event: 'leaderboardRefresh',
  on: true,
  async listener(RClient: RestClient) {
    const LCache = leaderboardCache;
    process.env.LEADERBOARD = 'false';
    console.log('Leaderboard Refresh Initiated');

    const promises = [];

    // Anemo refresh

    promises.push(
      setLeaderboardData(
        {
          collection: LCache.anemo.skill.open,
          dmgCategory: 'anemo-dmg-skill',
          typeCategory: 'open',
        },
        RClient,
      ),
      setLeaderboardData(
        {
          collection: LCache.anemo.skill.solo,
          dmgCategory: 'anemo-dmg-skill',
          typeCategory: 'solo',
        },
        RClient,
      ),
    );

    // Geo Refresh
    promises.push(
      setLeaderboardData(
        { collection: LCache.geo.skill.open, dmgCategory: 'geo-dmg-skill', typeCategory: 'open' },
        RClient,
      ),
      setLeaderboardData(
        { collection: LCache.geo.skill.solo, dmgCategory: 'geo-dmg-skill', typeCategory: 'solo' },
        RClient,
      ),
    );

    // Electro Refresh
    promises.push(
      setLeaderboardData(
        {
          collection: LCache.electro.skill.open,
          dmgCategory: 'electro-dmg-skill',
          typeCategory: 'open',
        },
        RClient,
      ),
      setLeaderboardData(
        {
          collection: LCache.electro.skill.solo,
          dmgCategory: 'electro-dmg-skill',
          typeCategory: 'solo',
        },
        RClient,
      ),
    );

    // Universal n5 Refresh
    promises.push(
      setLeaderboardData(
        { collection: LCache.universal.n5.open, dmgCategory: 'uni-dmg-n5', typeCategory: 'open' },
        RClient,
      ),
      setLeaderboardData(
        { collection: LCache.universal.n5.solo, dmgCategory: 'uni-dmg-n5', typeCategory: 'solo' },
        RClient,
      ),
    );

    await Promise.all(promises).then(() => {
      process.env.LEADERBOARD = 'true';
      console.log('Leaderboard Refresh Complete');
      console.log('Sending leaderboard update request');
      PMAEventHandler.emit('leaderboardUpdate', RClient);
    });
  },
};

export default leaderboardRefresh;
