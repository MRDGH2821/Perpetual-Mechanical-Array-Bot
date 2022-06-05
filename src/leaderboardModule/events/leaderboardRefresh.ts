import { RestClient } from 'detritus-client/lib/rest';
import BotEvent from '../../lib/BotEvent';
import { getLBCacheObject, setLeaderboardData } from '../../lib/leaderboardCacheManager';
import { getRestClient, getShardClient } from '../../lib/BotClientExtracted';
import { Debugging, PMAEventHandler } from '../../lib/Utilities';
import { LeaderboardUpdateEventArgs } from '../../botTypes/types';

export default new BotEvent({
  event: 'leaderboardRefresh',
  on: true,
  async listener(RClient: RestClient = getRestClient()) {
    const LCache = getLBCacheObject();
    process.env.LEADERBOARD = 'false';
    console.log('Leaderboard Refresh Initiated');

    const promises = [];

    // Anemo refresh

    promises.push(
      setLeaderboardData({
        collection: LCache.anemo.skill.open,
        dmgCategory: 'anemo-dmg-skill',
        typeCategory: 'open',
      }).then(() => console.log('Anemo open done')),
      setLeaderboardData({
        collection: LCache.anemo.skill.solo,
        dmgCategory: 'anemo-dmg-skill',
        typeCategory: 'solo',
      }).then(() => console.log('Anemo solo done')),
    );

    // Geo Refresh
    promises.push(
      setLeaderboardData({
        collection: LCache.geo.skill.open,
        dmgCategory: 'geo-dmg-skill',
        typeCategory: 'open',
      }).then(() => console.log('Geo open done')),
      setLeaderboardData({
        collection: LCache.geo.skill.solo,
        dmgCategory: 'geo-dmg-skill',
        typeCategory: 'solo',
      }).then(() => console.log('Geo solo done')),
    );

    // Electro Refresh
    promises.push(
      setLeaderboardData({
        collection: LCache.electro.skill.open,
        dmgCategory: 'electro-dmg-skill',
        typeCategory: 'open',
      }).then(() => console.log('Electro open done')),
      setLeaderboardData({
        collection: LCache.electro.skill.solo,
        dmgCategory: 'electro-dmg-skill',
        typeCategory: 'solo',
      }).then(() => console.log('Electro solo done')),
    );

    // Universal n5 Refresh
    promises.push(
      setLeaderboardData({
        collection: LCache.uni.n5.open,
        dmgCategory: 'uni-dmg-n5',
        typeCategory: 'open',
      }).then(() => console.log('Uni open done')),
      setLeaderboardData({
        collection: LCache.uni.n5.solo,
        dmgCategory: 'uni-dmg-n5',
        typeCategory: 'solo',
      }).then(() => console.log('Uni solo done')),
    );

    await Promise.all(promises).then(() => {
      process.env.LEADERBOARD = 'true';
      console.log('Leaderboard Refresh Complete');
      Debugging.leafDebug(LCache, true);

      console.log('Sending leaderboard update request');

      PMAEventHandler.emit('leaderboardUpdate', <LeaderboardUpdateEventArgs>{
        RClient,
        SClient: getShardClient(),
      });
    });
  },
});