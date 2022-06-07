import BotEvent from '../../lib/BotEvent';
import { getHoFCacheObject, setHallOfFameData } from '../../lib/hallOfFameCacheManager';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'hallOfFameRefresh',
  on: true,
  async listener(updateHallOfFame: boolean = false) {
    const HoFCache = getHoFCacheObject();
    process.env.HALL_OF_FAME_READY = 'false';
    console.log('Hall Of Fame Refresh Initiated');

    const promises = [];

    // Anemo refresh

    promises.push(
      setHallOfFameData({
        collection: HoFCache.anemo.one,
        element: 'anemo',
        crownQuantity: 1,
      }).then(() => console.log('Anemo one crown done')),
      setHallOfFameData({
        collection: HoFCache.anemo.two,
        element: 'anemo',
        crownQuantity: 2,
      }).then(() => console.log('Anemo two crowns done')),
      setHallOfFameData({
        collection: HoFCache.anemo.three,
        element: 'anemo',
        crownQuantity: 3,
      }).then(() => console.log('Anemo three crowns done')),
    );

    // Geo Refresh

    promises.push(
      setHallOfFameData({
        collection: HoFCache.geo.one,
        element: 'geo',
        crownQuantity: 1,
      }).then(() => console.log('Geo one crown done')),
      setHallOfFameData({
        collection: HoFCache.geo.two,
        element: 'geo',
        crownQuantity: 2,
      }).then(() => console.log('Geo two crowns done')),
      setHallOfFameData({
        collection: HoFCache.geo.three,
        element: 'geo',
        crownQuantity: 3,
      }).then(() => console.log('Geo three crowns done')),
    );

    // Electro Refresh

    promises.push(
      setHallOfFameData({
        collection: HoFCache.electro.one,
        element: 'electro',
        crownQuantity: 1,
      }).then(() => console.log('Electro one crown done')),
      setHallOfFameData({
        collection: HoFCache.electro.two,
        element: 'electro',
        crownQuantity: 2,
      }).then(() => console.log('Electro two crowns done')),
      setHallOfFameData({
        collection: HoFCache.electro.three,
        element: 'electro',
        crownQuantity: 3,
      }).then(() => console.log('Electro three crowns done')),
    );

    // Unaligned Refresh

    promises.push(
      setHallOfFameData({
        collection: HoFCache.unaligned.one,
        element: 'unaligned',
        crownQuantity: 1,
      }).then(() => console.log('Unaligned crown done')),
    );

    await Promise.all(promises).then(() => {
      process.env.HALL_OF_FAME_READY = 'true';
      console.log('Hall Of Fame Refresh Complete');
      // Debugging.leafDebug(LCache, true);

      if (updateHallOfFame) {
        console.log('Sending Hall Of Fame update request');
        PMAEventHandler.emit('hallOfFameUpdate');
      }
    });
  },
});
