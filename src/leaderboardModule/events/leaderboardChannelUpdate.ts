import { Channel, Webhook } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import { ICONS } from '../../lib/Constants';
import { Debugging, PMAEventHandler } from '../../lib/Utilities';

const log = Debugging.leafDebug;

export default new BotEvent({
  event: 'leaderboardChannelUpdate',
  on: true,
  async listener(newChannel: Channel) {
    let finalWebhook: Webhook;
    try {
      const guildHooks = await newChannel.guild?.fetchWebhooks();
      const pmaHooks = guildHooks?.filter((webhook) => !!webhook.token);
      const selectedWebhook = pmaHooks?.find((webhook) => webhook.name === 'Damage Leaderboard');

      selectedWebhook?.edit({ channelId: newChannel.id, reason: 'Leaderboard Channel Changed' });

      if (selectedWebhook === undefined) {
        throw new Error('No webhooks found');
      }

      finalWebhook = selectedWebhook;
    } catch (error) {
      log(error);

      finalWebhook = await newChannel.createWebhook({
        name: 'Damage Leaderboard',
        avatar: ICONS.MASANORI,
      });
    }

    PMAEventHandler.emit('leaderboardSend', finalWebhook);
  },
});
