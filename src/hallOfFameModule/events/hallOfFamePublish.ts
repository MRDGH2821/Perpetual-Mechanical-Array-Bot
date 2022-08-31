import { sequentialPromises } from 'yaspr';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, COLORS } from '../../lib/Constants';
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
        await publishHoFNames('dendro', 'one'),
        await publishHoFNames('dendro', 'two'),
        await publishHoFNames('dendro', 'three'),
        await publishHoFNames('unaligned', 'one'),
      ].flat();

      const webhookDB = (await db.collection('hall-of-fame').doc('webhook').get()).data() as {
        channelID: string;
        webhookID: string;
      };

      const webhook = await SClient.rest.fetchWebhook(webhookDB.webhookID);

      const information: SimpleEmbed = {
        color: COLORS.EMBED_COLOR,
        title: '**Welcome to Hall Of Fame!**',
        description:
          'Welcome to Hall of Fame Traveler!\nHere you will find names of people who have crowned their traveler',
        fields: [
          {
            name: '***How do I enter?***',
            value: `Send an image of your traveler's talent screen <#${ChannelIds.ROLE_APPLICATION}>. After approval, Hall of Fame will get updated automatically!`,
          },
          {
            name: '**FAQs**',
            value: `Q1. The number of crowns in my name is incorrect!\nA. Please send a new screenshot of your traveler's talent screen again at <#${ChannelIds.ROLE_APPLICATION}>. After approval, it will get auto updated!`,
          },
        ],
      };

      await webhook.createMessage({
        embed: information,
      });

      const sendWebhook = (embed: SimpleEmbed) => webhook
        .createMessage({
          embed,
        })
        .catch((err) => Debugging.leafDebug(err, true));

      await sequentialPromises(allEmbeds, sendWebhook);
    } catch (err) {
      Debugging.leafDebug(err, true);
    }
  },
});
