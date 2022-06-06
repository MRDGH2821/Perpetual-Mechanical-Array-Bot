import { Channel, Webhook } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { Debugging, PMAEventHandler } from '../../lib/Utilities';

const log = Debugging.leafDebug;

export default new BotEvent({
  event: 'hallOfFameChannelUpdate',
  on: true,
  async listener(newChannel: Channel) {
    let finalWebhook: Webhook;
    try {
      const guildHooks = await newChannel.guild?.fetchWebhooks();
      const pmaHooks = guildHooks?.filter((webhook) => !!webhook.token);
      const selectedWebhook = pmaHooks?.find((webhook) => webhook.name === 'Hall Of Fame');

      selectedWebhook?.edit({ channelId: newChannel.id, reason: 'Hall Of Fame Channel Changed' });

      if (selectedWebhook === undefined) {
        throw new Error('No webhooks found');
      }

      finalWebhook = selectedWebhook;
    } catch (error) {
      log(error);

      finalWebhook = await newChannel.createWebhook({
        name: 'Hall Of Fame',
      });
    }
    await db
      .collection('hall-of-fame')
      .doc('webhook')
      .set({
        webhookID: finalWebhook.id,
        channelID: finalWebhook.channelId,
      })
      .then(() => console.log('Webhook details saved in database'));
    PMAEventHandler.emit('hallOfFameSend', finalWebhook);
  },
});
