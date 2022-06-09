import BotEvent from '../../lib/BotEvent';
import { getSACacheObject, setSpiralAbyssData } from '../../lib/spiralAbyssCacheManager';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'spiralAbyssRefresh',
  on: true,
  async listener(updateSABoard: boolean = false) {
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

      if (updateSABoard) {
        console.log('Sending Spiral Abyss update request');
        PMAEventHandler.emit('spiralAbyssUpdate');
      }
    });
  },
});
