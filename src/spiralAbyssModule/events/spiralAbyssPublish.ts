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

      const publishEmbeds = [publishConquerorEmb, publishTravelerEmb, publishSovereignEmb];

      console.log('Conqueror clear boards: ', publishConquerorEmb.length);
      console.log('Traveler clear boards: ', publishTravelerEmb.length);
      console.log('Sovereign clear boards: ', publishSovereignEmb.length);

      const webhookDB = (
        await db.collection('spiral-abyss-config').doc('webhook').get()
      ).data() as {
        channelID: string;
        webhookID: string;
      };
      console.log(webhookDB);
      const webhook = await SClient.rest.fetchWebhook(webhookDB.webhookID);

      for (const embeds of publishEmbeds) {
        for (const embed of embeds) {
          await webhook
            .createMessage({
              embed,
            })
            .then(() => console.log(`Sent ${embeds.indexOf(embed) + 1} of ${embeds.length}`))
            .catch((err) => Debugging.leafDebug(err));
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
});
