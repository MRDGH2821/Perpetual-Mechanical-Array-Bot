import BotEvent from '../../lib/BotEvent';
import { setSpiralAbyssData } from '../../lib/spiralAbyssCacheManager';

export default new BotEvent({
  event: 'spiralAbyssRefresh',
  on: true,
  async listener() {
    process.env.SPIRAL_ABYSS_READY = 'false';
    console.log('Spiral Abyss Refresh Initiated');

    const promises = [];

    promises.push(setSpiralAbyssData());

    await Promise.all(promises).then(() => {
      process.env.SPIRAL_ABYSS_READY = 'true';
      console.log('Spiral Abyss Refresh Complete');
      // Debugging.leafDebug(LCache, true);
    });
  },
});
