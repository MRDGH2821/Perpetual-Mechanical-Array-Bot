import BotEvent from '../../lib/BotEvent';
import { getSACacheObject, setSpiralAbyssData } from '../../lib/spiralAbyssCacheManager';

export default new BotEvent({
  event: 'spiralAbyssRefresh',
  on: true,
  async listener() {
    const SACache = getSACacheObject();
    process.env.SPIRAL_ABYSS_READY = 'false';
    console.log('Spiral Abyss Refresh Initiated');

    const promises = [];

    promises.push(
      setSpiralAbyssData({
        collection: SACache.clearNormal,
        withTraveler: false,
      }).then(() => console.log('Spiral Abyss normal done')),
      setSpiralAbyssData({
        collection: SACache.clearTraveler,
        withTraveler: true,
      }).then(() => console.log('Spiral Abyss with Traveler done')),
    );

    await Promise.all(promises).then(() => {
      process.env.SPIRAL_ABYSS_READY = 'true';
      console.log('Spiral Abyss Refresh Complete');
      // Debugging.leafDebug(LCache, true);
    });
  },
});
