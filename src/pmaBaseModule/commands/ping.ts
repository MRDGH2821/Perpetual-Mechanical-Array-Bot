import { COLORS } from '@lib/Constants';
import EnvConfig from '@lib/EnvConfig';
import { RequestTypes } from 'detritus-client-rest';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'ping',
  description: 'Shows bot ping',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  async run(context) {
    const { gateway, rest } = await context.client.ping();

    await context.editOrRespond('Pinging...');

    const pingEmb: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Pong!**',
      color: COLORS.EMBED_COLOR,
      description: `Gateway Ping: ${gateway}ms\nREST Ping: ${rest}ms`,
    };

    await context.editOrRespond({
      embeds: [pingEmb],
    });
  },
  onRunError(ctw) {
    console.log(ctw);
  },
});
