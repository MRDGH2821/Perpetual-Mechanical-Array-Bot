import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from '../lib/EnvConfig';
import { COLORS } from '../lib/Constants';

export default new InteractionCommand({
  name: 'test',
  description: 'Sends test msg',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  async run(ctx) {
    const txtEmb = {
      title: '**Test**',
      description: 'Test embed, meaning this works...',
      color: COLORS.EMBED_COLOR,
    };

    await ctx.editOrRespond({ embeds: [txtEmb] });
  },
});
