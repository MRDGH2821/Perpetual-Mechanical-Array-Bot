import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { HALL_OF_FAME_ELEMENT_CHOICES } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { isHoFRefreshComplete, publishHoFNames } from '../../lib/hallOfFameCacheManager';
import {
  moduleUpdatesSetup, PMAEventHandler, StaffCheck, viewPages,
} from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'hall-of-fame',
  description: 'Hall of Fame Commands',
  global: false,
  guildIds: [EnvConfig.guildId],
  onBeforeRun(ctx) {
    if (!isHoFRefreshComplete()) {
      ctx.editOrRespond({
        content: 'Please wait before using this command, refresh is not complete',
        flags: MessageFlags.EPHEMERAL,
      });
    }
    return isHoFRefreshComplete();
  },
  options: [
    moduleUpdatesSetup('hallOfFameChannelUpdate'),
    {
      name: 'refresh',
      description: 'Refreshes Hall Of Fame cache',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,

      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx) {
        PMAEventHandler.emit('hallOfFameRefresh');

        ctx.editOrRespond({
          content: 'Refresh initiated, please wait for a while before using this command\n',
        });
      },
    },

    {
      name: 'view',
      description: 'View Hall Of Fame',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'element',
          description: 'Select Element',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: HALL_OF_FAME_ELEMENT_CHOICES,
        },
        {
          name: 'crown_quantity',
          description: 'Select Crown Quantity',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            { name: 'One (1)', value: 'one' },
            { name: 'Two (2)', value: 'two' },
            { name: 'Three (3)', value: 'three' },
          ],
        },
      ],
      async run(ctx, args) {
        let qty = args.crown_quantity;
        if (args.element === 'unaligned') {
          qty = 'one';
        }
        const hallOfFameEmbeds = await publishHoFNames(args.element, qty);
        await viewPages(hallOfFameEmbeds)(ctx);
      },
    },
    {
      name: 'publish',
      description: 'Publishes the names of crown role holders',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      async run(ctx) {
        PMAEventHandler.emit('hallOfFamePublish');
        await ctx.editOrRespond({
          content: 'Hall of Fame will be published soon',
          flags: MessageFlags.EPHEMERAL,
        });
      },
    },
  ],
});
