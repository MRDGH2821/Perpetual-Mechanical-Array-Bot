import { ShardClient } from 'detritus-client';
import BotEvent from '../../lib/BotEvent';
import db, { deleteCollection } from '../../lib/Firestore';
import { publishSANames, spiralAbyssCache } from '../../lib/spiralAbyssCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'spiralAbyssPublish',
  on: true,
  async listener({
    SClient,
    deleteCache,
    clearDB,
  }: {
    SClient: ShardClient;
    deleteCache: boolean;
    clearDB: boolean;
  }) {
    try {
      const publishNormalEmb = await publishSANames();
      const publishTravelerEmb = await publishSANames(true);

      console.log('Normal clear boards: ', publishNormalEmb.length);
      console.log('Traveler clear boards: ', publishTravelerEmb.length);

      const webhookDB = (
        await db.collection('spiral-abyss-config').doc('webhook').get()
      ).data() as {
        channelID: string;
        webhookID: string;
      };
      console.log(webhookDB);
      const webhook = await SClient.rest.fetchWebhook(webhookDB.webhookID);
      console.log('Sending normal clears');
      // eslint-disable-next-line no-restricted-syntax
      for (const embed of publishNormalEmb) {
        // eslint-disable-next-line no-await-in-loop
        await webhook
          .createMessage({
            embed,
            wait: true,
          })
          .then(() => console.log(`Sent ${publishNormalEmb.indexOf(embed)} of ${publishNormalEmb.length}`))
          .catch((err) => Debugging.leafDebug(err));
      }
      console.log('Sending Normal clears finished');
      console.log('SEnding traveler clears');
      // eslint-disable-next-line no-restricted-syntax
      for (const embed of publishTravelerEmb) {
        // eslint-disable-next-line no-await-in-loop
        await webhook
          .createMessage({
            embed,
          })
          .then(() => console.log(
            `Sent ${publishTravelerEmb.indexOf(embed)} of ${publishTravelerEmb.length}`,
          ))
          .catch((err) => Debugging.leafDebug(err));
      }
      console.log('Sending traveler clears finished');

      // delete cache
      if (deleteCache === true) {
        spiralAbyssCache.clearNormal.clear();
        spiralAbyssCache.clearTraveler.clear();
      }

      // delete DB
      if (clearDB === true) {
        deleteCollection('spiral-abyss-current');
      }
    } catch (error) {
      console.log(error);
    }
  },
});
