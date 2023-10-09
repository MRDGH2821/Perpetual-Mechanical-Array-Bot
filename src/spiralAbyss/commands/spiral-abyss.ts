import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType, time } from 'discord.js';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { viewBook } from '../../lib/utils';
import { SAJobSchedule } from '../../scheduledTasks';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { SPIRAL_ABYSS_TYPE_CHOICES } from '../lib/Constants';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';
import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';

const cmdDef: JSONCmd = {
  name: 'spiral-abyss',
  description: 'Spiral Abyss commands',
  options: [
    {
      type: 1,
      name: 'ranks',
      description: 'Show Spiral Abyss rankings',
      options: [
        {
          name: 'clear_type',
          description: 'Select Clear Type',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: SPIRAL_ABYSS_TYPE_CHOICES,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'when-refresh',
      description: 'When does the Spiral Abyss refresh?',
    },
  ],
};
export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      preconditions: ['SACacheCheck'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          async chatInputRun(interaction) {
            const clearType = interaction.options.getString(
              'clear_type',
              true,
            ) as SpiralAbyssClearTypes;

            await interaction.deferReply({
              ephemeral: true,
            });

            const embeds = await SpiralAbyssCache.generateEmbeds(clearType, 10);
            const pager = await viewBook(embeds);
            return pager(interaction);
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          async chatInputRun(interaction) {
            const SAPublishDate = SAJobSchedule.nextInvocation();

            return interaction.reply({
              embeds: [
                {
                  color: COLORS.EMBED_COLOR,
                  title: 'Spiral Abyss Refresh Schedule',
                  description: `Next refresh is scheduled at: ${time(SAPublishDate)} (${time(
                    SAPublishDate,
                    'R',
                  )})`,
                  footer: {
                    text: 'Note: It will roughly take 30 mins to reflect new data in respective channel',
                  },
                },
              ],
            });
          },
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
