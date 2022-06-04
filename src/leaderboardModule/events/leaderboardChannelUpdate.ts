import { Channel, Webhook } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import { ICONS } from '../../lib/Constants';
import { Debugging, PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'leaderboardChannelUpdate',
  on: true,
  async listener(newChannel: Channel) {
    let finalWebhook: Webhook;
    try {
      const guildHooks = await newChannel.guild?.fetchWebhooks();
      const pmaHooks = guildHooks?.filter((webhook) => webhook.user?.id === webhook.applicationId);
      const selectedWebhook = pmaHooks?.find((webhook) => webhook.name === 'Damage Leaderboard');

      selectedWebhook?.edit({ channelId: newChannel.id, reason: 'Leaderboard Channel Changed' });
      finalWebhook = selectedWebhook!;
    } catch (error) {
      Debugging.leafDebug(error);

      finalWebhook = await newChannel.createWebhook({
        name: 'Damage Leaderboard',
        avatar: ICONS.MASANORI,
      });
    }

    PMAEventHandler.emit('leaderboardSend', finalWebhook);
  },
});
