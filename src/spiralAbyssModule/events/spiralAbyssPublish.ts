import { sequentialPromises } from 'yaspr';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { publishSANames } from '../../lib/spiralAbyssCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'spiralAbyssPublish',
  on: true,
  async listener() {
    const SClient = getShardClient();
    try {
      const publishConquerorEmb = await publishSANames('Abyssal Conqueror');
      const publishTravelerEmb = await publishSANames('Abyssal Traveler');
      const publishSovereignEmb = await publishSANames('Abyssal Sovereign');

      const publishEmbeds = [publishConquerorEmb, publishTravelerEmb, publishSovereignEmb].flat();

      // console.log('Conqueror clear boards: ', publishConquerorEmb.length);
      // console.log('Traveler clear boards: ', publishTravelerEmb.length);
      // console.log('Sovereign clear boards: ', publishSovereignEmb.length);

      const webhookDB = (
        await db.collection('spiral-abyss-config').doc('webhook').get()
      ).data() as {
        channelID: string;
        webhookID: string;
      };
      // console.log(webhookDB);
      const webhook = await SClient.rest.fetchWebhook(webhookDB.webhookID);

      const sendWebhook = (embed: SimpleEmbed) => webhook
        .createMessage({
          embed,
        })
        .catch((err) => Debugging.leafDebug(err, true));

      await sequentialPromises(publishEmbeds, sendWebhook);
    } catch (error) {
      Debugging.leafDebug(error, true);
    }
  },
});
