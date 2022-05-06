import { RequestTypes } from 'detritus-client-rest';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'test',
  description: 'Sends test msg',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  async run(ctx) {
    const txtEmb: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Test**',
      description: 'Test embed, meaning this works...',
      color: COLORS.EMBED_COLOR,
    };

    await ctx.editOrRespond({ embeds: [txtEmb] });
  },
});
