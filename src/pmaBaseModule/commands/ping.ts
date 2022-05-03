import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'ping',
  description: 'Shows bot ping',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  async run(context) {
    const { gateway, rest } = await context.client.ping();
    console.log('code reached');
    await context.editOrRespond(`pong! (gateway: ${gateway}ms) (rest: ${rest}ms)`);
  },
  onRunError(ctw) {
    console.log(ctw);
  },
});
