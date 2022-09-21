import { Permissions } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'restart',
  description: 'Restart the bot if there is any problem',
  global: false,
  guildIds: [EnvConfig.guildId],
  permissions: [Permissions.ADMINISTRATOR],
  onPermissionsFail(ctx) {
    ctx.editOrRespond({
      content: 'This command an only be run by admins, not even a mod',
    });
  },
  async run(ctx) {
    await ctx.editOrRespond({ content: 'The bot will restart soon' }).then(() => {
      process.exit(0);
    });
  },
});
