import { Channel, Webhook } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import { ICONS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { Debugging, PMAEventHandler } from '../../lib/Utilities';

const log = Debugging.leafDebug;

export default new BotEvent({
  event: 'spiralAbyssChannelUpdate',
  on: true,
  async listener(newChannel: Channel) {
    let finalWebhook: Webhook;
    try {
      const guildHooks = await newChannel.guild?.fetchWebhooks();
      const pmaHooks = guildHooks?.filter((webhook) => !!webhook.token);
      const selectedWebhook = pmaHooks?.find((webhook) => webhook.name === 'Spiral Abyss');

      selectedWebhook?.edit({ channelId: newChannel.id, reason: 'Spiral Abyss Channel Changed' });

      if (selectedWebhook === undefined) {
        throw new Error('No webhooks found');
      }

      finalWebhook = selectedWebhook;
    } catch (error) {
      log(error);

      finalWebhook = await newChannel.createWebhook({
        name: 'Spiral Abyss',
        avatar: ICONS.SPIRAL_ABYSS,
      });
    }
    await db
      .collection('spiral-abyss-config')
      .doc('webhook')
      .set({
        webhookID: finalWebhook.id,
        channelID: finalWebhook.channelId,
      })
      .then(() => console.log('Webhook details saved in database'));
    PMAEventHandler.emit('spiralAbyssSend', finalWebhook);
  },
});
