import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ChannelTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import EnvConfig from '../../lib/EnvConfig';
import { isSARefreshComplete, publishSANames } from '../../lib/spiralAbyssCacheManager';
import { PMAEventHandler, StaffCheck, viewPages } from '../../lib/Utilities';
import reset from '../subcommands/reset';

export default new InteractionCommand({
  name: 'spiral_abyss',
  description: 'Spiral Abyss commands',
  global: false,
  guildIds: [EnvConfig.guildId],
  type: ApplicationCommandTypes.CHAT_INPUT,
  onBeforeRun(ctx) {
    if (!isSARefreshComplete()) {
      ctx.editOrRespond({
        content: 'Refresh is ongoing, please wait for a while before using this command',
        flags: MessageFlags.EPHEMERAL,
      });
    }
    return isSARefreshComplete();
  },
  options: [
    /* jscpd:ignore-start */
    {
      name: 'setup',
      description: 'Select channel where Spiral Abyss updates will come',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel where leaderboard updates will come',
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: true,
          channelTypes: [ChannelTypes.GUILD_TEXT],
        },
      ],
      async onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx, args) {
        const setupChannel = args.channel as Channel;

        await ctx.editOrRespond({
          content: `Selected channel: ${setupChannel.mention} `,
          flags: MessageFlags.EPHEMERAL,
        });

        PMAEventHandler.emit('spiralAbyssChannelUpdate', setupChannel);
      },
    },
    /* jscpd:ignore-end */
    {
      name: 'refresh',
      description: 'Refreshes Spiral Abyss cache',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,

      async onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      run(ctx) {
        PMAEventHandler.emit('spiralAbyssRefresh');

        ctx.editOrRespond({
          content: 'Refresh initiated, please wait for a while before using this command',
          flags: MessageFlags.EPHEMERAL,
        });
      },
    },
    {
      name: 'view',
      description: 'View individual leaderboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'with_traveler',
          description: 'Select category to view',
          type: ApplicationCommandOptionTypes.BOOLEAN,
          required: true,
        },
      ],

      async run(ctx, args) {
        const SAEmbeds = await publishSANames(args.with_traveler);

        await ctx.editOrRespond({
          embed: SAEmbeds[0],
          components: [viewPages(SAEmbeds)],
        });
      },
    },
    reset,
  ],
});
