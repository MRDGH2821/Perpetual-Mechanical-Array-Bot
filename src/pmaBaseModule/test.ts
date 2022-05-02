import { ApplicationCommandTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { COLORS } from '../lib/Constants';

export default new InteractionCommand({
  name: 'test',
  description: 'Sends test msg',
  async run(ctx) {
    const txtEmb = {
      title: '**Test**',
      description: 'Test embed, meaning this works...',
      color: COLORS.EMBED_COLOR,
    };

    await ctx.respond(ApplicationCommandTypes.CHAT_INPUT, { embeds: [txtEmb] });
  },
});
