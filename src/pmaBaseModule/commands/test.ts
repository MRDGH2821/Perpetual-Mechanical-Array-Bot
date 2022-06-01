import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from 'lib/EnvConfig';

export default new InteractionCommand({
  name: 'test',
  description: 'experimental command',
  global: false,
  guildIds: [EnvConfig.guildId!],

  async run(ctx) {
    ctx.editOrRespond({
      content: 'It works!',
    });
  },
});
