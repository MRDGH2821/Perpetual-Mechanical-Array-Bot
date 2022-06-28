import BotEvent from '../../lib/BotEvent';
import { getLBCacheObject, setLeaderboardData } from '../../lib/leaderboardCacheManager';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'leaderboardRefresh',
  on: true,
  async listener(updateLeaderboard: boolean = false) {
    const LCache = getLBCacheObject();
    process.env.LEADERBOARD_READY = 'false';
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
      process.env.LEADERBOARD_READY = 'true';
      console.log('Leaderboard Refresh Complete');
      // Debugging.leafDebug(LCache, true);

      if (updateLeaderboard) {
        console.log('Sending leaderboard update request');
        PMAEventHandler.emit('leaderboardUpdate');
      }
    });
  },
});
