import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ChannelTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import {
  isSARefreshComplete,
  showcaseSpiralAbyssGenerate,
  spiralAbyssViewGenerate,
} from '../../lib/spiralAbyssCacheManager';
import { getAbyssQuote, PMAEventHandler, StaffCheck } from '../../lib/Utilities';
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
      name: 'view_summary',
      description: 'View individual spiral abyss summary',
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
        const emb = await showcaseSpiralAbyssGenerate(args.with_traveler);

        ctx.editOrRespond({
          embed: emb,
        });
      },

      onRunError(ctx, args, error) {
        ctx.editOrRespond({
          embed: {
            title: 'An error occurred',
            color: COLORS.ERROR,
            description: 'Spiral Abyss board could not be fetched',
            fields: [
              {
                name: '**Error message**',
                value: `${error || 'Check console'}`,
              },
            ],
          },
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
        const SAEmbeds = await spiralAbyssViewGenerate(args.with_traveler);

        const totalEmbeds = SAEmbeds.length;
        let currentIndex = 0;

        const viewRow = new ComponentActionRow()
          .addButton({
            emoji: '⬅️',
            label: 'Previous',
            customId: 'previous',
            style: MessageComponentButtonStyles.SECONDARY,
            async run(btnCtx) {
              if (currentIndex >= 0) {
                currentIndex -= 1;
                await btnCtx.editOrRespond({
                  embed: SAEmbeds[currentIndex],
                  components: [viewRow],
                });
              } else {
                await btnCtx.editOrRespond({
                  content: getAbyssQuote(),
                  components: [viewRow],
                });
              }
            },
          })
          .addButton({
            emoji: '➡️',
            label: 'Next',
            customId: 'next',
            style: MessageComponentButtonStyles.SECONDARY,
            async run(btnCtx) {
              if (currentIndex < totalEmbeds) {
                currentIndex += 1;
                await btnCtx.editOrRespond({
                  embed: SAEmbeds[currentIndex],
                  components: [viewRow],
                });
              } else {
                await btnCtx.editOrRespond({
                  content: getAbyssQuote(),
                  components: [viewRow],
                });
              }
            },
          });

        await ctx.editOrRespond({
          embed: SAEmbeds[currentIndex],
          components: [viewRow],
        });
      },
    },
    reset,
  ],
});
