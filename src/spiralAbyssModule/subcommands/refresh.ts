import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions } from 'detritus-client/lib/interaction';
import { PMAEventHandler, StaffCheck } from '../../lib/Utilities';

const refresh: InteractionCommandOptionOptions = {
  name: 'refresh',
  description: 'Use this to refresh Spiral AByss data',
  type: ApplicationCommandOptionTypes.SUB_COMMAND,

  async onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx) {
    PMAEventHandler.emit('spiralAbyssRefresh');
    await ctx.editOrRespond({
      content:
        'Spiral abyss refresh request sent. Please wait for a while before using spiral abyss commands',
      flags: MessageFlags.EPHEMERAL,
    });
  },
};

export default refresh;
