import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import { HALL_OF_FAME_ELEMENT_CHOICES } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import {
  hallOfFameViewGenerate,
  isHoFRefreshComplete,
  showcaseHallOfFameGenerate,
} from '../../lib/hallOfFameCacheManager';
import { PMAEventHandler, StaffCheck, viewPages } from '../../lib/Utilities';

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
    /* jscpd:ignore-start */
    {
      name: 'setup',
      description: 'Select channel where hall of fame updates will come',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel where hall of fame updates will come',
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: true,
          channelTypes: [ChannelTypes.GUILD_TEXT],
        },
      ],
      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx, args) {
        const setupChannel = args.channel as Channel;

        await ctx.editOrRespond({
          content: `Selected channel: ${setupChannel.mention} `,
          flags: MessageFlags.EPHEMERAL,
        });

        PMAEventHandler.emit('hallOfFameChannelUpdate', setupChannel);
      },
    },
    /* jscpd:ignore-end */
    {
      name: 'refresh',
      description: 'Refreshes Hall Of Fame cache & optionally updates Hall Of Fame channel',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'update_hall_of_fame',
          description: 'Should update Hall Of Fame after cache refresh? (default False)',
          type: ApplicationCommandOptionTypes.BOOLEAN,
          default: false,
        },
      ],
      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx, args) {
        PMAEventHandler.emit('hallOfFameRefresh', args.update_hall_of_fame);

        ctx.editOrRespond({
          content: `Refresh initiated, please wait for a while before using this command\nWill update Leaderboard? \`${args.update_hall_of_fame}\``,
        });
      },
    },
    {
      name: 'view_summary',
      description: 'View individual hall of fame summary',
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
        const embed = await showcaseHallOfFameGenerate(args.element);
        await ctx.editOrRespond({
          embed,
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
      ],
      async run(ctx, args) {
        let qty = args.crown_quantity;
        if (args.element === 'unaligned') {
          qty = 'one';
        }

        const hallOfFameEmbeds = await hallOfFameViewGenerate(args.element, qty);

        await ctx.editOrRespond({
          embed: hallOfFameEmbeds[0],
          components: [viewPages(hallOfFameEmbeds)],
        });
      },
    },
  ],
});
