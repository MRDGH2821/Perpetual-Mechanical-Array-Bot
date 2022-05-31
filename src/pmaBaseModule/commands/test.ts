import EnvConfig from '@lib/EnvConfig';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'test',
  description: 'experimental command',
  global: false,
  guildIds: [EnvConfig.guildId!],

  async run(ctx) {
    ctx.editOrRespond({
      embed: {
        description: '**This works!**',
      },
    });
  },
});
