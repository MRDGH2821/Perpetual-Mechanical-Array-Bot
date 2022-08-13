import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { publishHoFNames } from '../../lib/hallOfFameCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'hallOfFamePublish',
  on: true,
  async listener() {
    const SClient = getShardClient();
    try {
      const allEmbeds = [
        await publishHoFNames('anemo', 'one'),
        await publishHoFNames('anemo', 'two'),
        await publishHoFNames('anemo', 'three'),
        await publishHoFNames('geo', 'one'),
        await publishHoFNames('geo', 'two'),
        await publishHoFNames('geo', 'three'),
        await publishHoFNames('electro', 'one'),
        await publishHoFNames('electro', 'two'),
        await publishHoFNames('electro', 'three'),
        await publishHoFNames('unaligned', 'one'),
      ];
      const webhookDB = (await (
        await db.collection('hall-of-fame').doc('webhook').get()
      ).data()) as { channelID: string; webhookID: string };

      const webhook = await SClient.rest.fetchWebhook(webhookDB.webhookID);
      // eslint-disable-next-line no-restricted-syntax
      for (const embeds of allEmbeds) {
        // eslint-disable-next-line no-restricted-syntax
        for (const embed of embeds) {
          // eslint-disable-next-line no-await-in-loop
          await webhook
            .createMessage({
              embed,
            })
            .then(() => console.log(`Sent ${embeds.indexOf(embed) + 1} of ${embeds.length}`))
            .catch((err) => Debugging.leafDebug(err));
        }
      }
    } catch (err) {
      Debugging.leafDebug(err, true);
    }
  },
});
