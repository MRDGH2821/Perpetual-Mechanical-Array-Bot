import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'ping',
  description: 'Shows bot ping',
  async run(context) {
    try {
      const { gateway, rest } = await context.client.ping();
      console.log('code reached');
      return await context.editOrRespond(`pong! (gateway: ${gateway}ms) (rest: ${rest}ms)`);
    } catch (error) {
      console.log(error);
    }
  },
  onRunError(ctw) {
    console.log(ctw);
    console.log('run error');
  },
});
