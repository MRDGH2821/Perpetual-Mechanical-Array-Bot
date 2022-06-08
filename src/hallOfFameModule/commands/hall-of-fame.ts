import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { ELEMENTS } from '../../botTypes/types';
import EnvConfig from '../../lib/EnvConfig';
import {
  hallOfFameViewGenerate,
  isHoFRefreshComplete,
  showcaseHallOfFameGenerate,
} from '../../lib/hallOfFameCacheManager';
import { getAbyssQuote, PMAEventHandler, StaffCheck } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'hall-of-fame',
  description: 'Hall of Fame Commands',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
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
      async onBeforeRun(ctx) {
        if (!isHoFRefreshComplete()) {
          ctx.editOrRespond({
            content: 'Please wait before using this command, refresh is not complete',
            flags: MessageFlags.EPHEMERAL,
          });
        }

        return (await StaffCheck.isCtxStaff(ctx, true)) && isHoFRefreshComplete();
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
      async onBeforeRun(ctx) {
        if (!isHoFRefreshComplete()) {
          ctx.editOrRespond({
            content: 'Please wait before using this command, refresh is not complete',
            flags: MessageFlags.EPHEMERAL,
          });
        }

        return (await StaffCheck.isCtxStaff(ctx, true)) && isHoFRefreshComplete();
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
          choices: <{ name: string; value: ELEMENTS }[]>[
            {
              name: 'Herrscher of Wind (Anemo)',
              value: 'anemo',
            },
            {
              name: 'Jūnzhǔ of Earth (Geo)',
              value: 'geo',
            },
            {
              name: "Ten'nō of Thunder (Electro)",
              value: 'electro',
            },
            {
              name: 'Arbitrator of Fate (Unaligned)',
              value: 'unaligned',
            },
          ],
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
      onBeforeRun(ctx) {
        if (!isHoFRefreshComplete()) {
          ctx.editOrRespond({
            content: 'Refresh is ongoing, please wait for a while before using this command',
            flags: MessageFlags.EPHEMERAL,
          });
        }
        return isHoFRefreshComplete();
      },
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
          choices: <{ name: string; value: ELEMENTS }[]>[
            {
              name: 'Herrscher of Wind (Anemo)',
              value: 'anemo',
            },
            {
              name: 'Jūnzhǔ of Earth (Geo)',
              value: 'geo',
            },
            {
              name: "Ten'nō of Thunder (Electro)",
              value: 'electro',
            },
            {
              name: 'Arbitrator of Fate (Unaligned)',
              value: 'unaligned',
            },
          ],
        },
      ],
      onBeforeRun(ctx) {
        if (!isHoFRefreshComplete()) {
          ctx.editOrRespond({
            content: 'Refresh is ongoing, please wait for a while before using this command',
            flags: MessageFlags.EPHEMERAL,
          });
        }
        return isHoFRefreshComplete();
      },
      async run(ctx, args) {
        let qty = args.crown_quantity;
        if (args.element === 'unaligned') {
          qty = 'one';
        }

        const hallOfFameEmbeds = await hallOfFameViewGenerate(args.element, qty);
        const totalEmbeds = hallOfFameEmbeds.length;
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
                  embed: hallOfFameEmbeds[currentIndex],
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
                  embed: hallOfFameEmbeds[currentIndex],
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
          embed: hallOfFameEmbeds[currentIndex],
          components: [viewRow],
        });
      },
    },
  ],
});
