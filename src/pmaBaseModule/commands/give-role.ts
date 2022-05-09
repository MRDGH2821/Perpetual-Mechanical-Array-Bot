import EnvConfig from '@pma-lib/EnvConfig';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'give-role',
  global: false,
  guildIds: [EnvConfig.guildId as string],
});
