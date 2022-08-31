import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { SpiralAbyssClearTypes } from '../../botTypes/types';
import EnvConfig from '../../lib/EnvConfig';
import { isSARefreshComplete, publishSANames } from '../../lib/spiralAbyssCacheManager';
import { moduleUpdatesSetup, viewPages } from '../../lib/Utilities';
import refresh from '../subcommands/refresh';
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
    moduleUpdatesSetup('spiralAbyssChannelUpdate'),
    {
      name: 'view',
      description: 'View individual leaderboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'clear_type',
          description: 'Select category to view',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: <{ name: SpiralAbyssClearTypes; value: SpiralAbyssClearTypes }[]>[
            {
              name: 'Abyssal Conqueror',
              value: 'Abyssal Conqueror',
            },
            {
              name: 'Abyssal Sovereign',
              value: 'Abyssal Sovereign',
            },
            {
              name: 'Abyssal Traveler',
              value: 'Abyssal Traveler',
            },
          ],
        },
      ],

      async run(ctx, args: { clear_type?: SpiralAbyssClearTypes }) {
        const SAEmbeds = await publishSANames(args.clear_type!);
        await viewPages(SAEmbeds)(ctx);
      },
    },
    reset,
    refresh,
  ],
});
