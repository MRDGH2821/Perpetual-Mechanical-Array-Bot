import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import { ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new BotEvent({
  event: 'removeRNGFreezeMute',
  once: true,
  async listener() {
    console.log('Un-muting users');
    const SClient = getShardClient();
    const freezeRNGRole = (await SClient.rest.fetchGuildRoles(EnvConfig.guildId)).get(
      ROLE_IDS.OTHERS.FROZEN_RNG,
    );
    const mutedUsers = freezeRNGRole?.members.length || 0;
    freezeRNGRole?.members.forEach((member) => {
      member.removeRole(ROLE_IDS.OTHERS.FROZEN_RNG, {
        reason: 'Bot restarted, cannot have them muted for long duration',
      });
    });

    console.log(`Unmuted ${mutedUsers} users`);
  },
});
