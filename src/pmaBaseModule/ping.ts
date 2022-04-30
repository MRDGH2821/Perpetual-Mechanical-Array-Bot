import { InteractionCommand } from 'detritus-client/lib/interaction';
import { COLORS } from '../lib/Constants';

export default new InteractionCommand({
  name: 'ping',
  description: 'Shows bot ping',
  async run(ctx) {
    const before = performance.now();
    const pingEmb = {
      title: '**Pinging**',
      description: 'Please wait...',
      color: COLORS.EMBED_COLOR,
    };

    await ctx.editOrRespond({ embeds: [pingEmb] });

    pingEmb.description = `Websocket ping: ${ctx.client.gateway.ping}ms\nBot Ping: ${
      performance.now() - before
    }ms`;

    await ctx.editOrRespond({ embeds: [pingEmb] });
  },
});
