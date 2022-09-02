import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import { InteractionDataComponent } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import { ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new BotEvent({
  event: ClientEvents.INTERACTION_CREATE,
  on: true,
  async listener(payload: GatewayClientEvents.InteractionCreate) {
    const { interaction } = payload;
    const componentData = payload.interaction.data as InteractionDataComponent;
    if (componentData.customId === 'unmute_me_rng') {
      const SClient = interaction.client;
      const member = await SClient.rest.fetchGuildMember(EnvConfig.guildId, interaction.userId);

      member
        .edit({
          communicationDisabledUntil: null,
          reason: "Removed timeout on user's request (timed out by RNG luck)",
        })
        .catch(console.log);
      member.removeRole(ROLE_IDS.OTHERS.FROZEN_RNG, {
        reason: "Removed freeze mute role on user's request (muted by RNG luck)",
      });

      interaction.editOrRespond({
        content: 'Timeout/mute role successfully removed.',
        components: [],
      });
      console.log('Unmuted the user');
      // interaction.channel?.createMessage('Timeout/mute role successfully removed.');
    }
  },
});
