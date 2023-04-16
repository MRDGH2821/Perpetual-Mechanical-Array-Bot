import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType } from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import { viewBook } from '../../lib/utils';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { LEADERBOARD_DAMAGE_TYPE_CHOICES } from '../lib/Constants';
import LeaderboardCache from '../lib/LeaderboardCache';
import type { GroupCategoryType, LBElements } from '../typeDefs/leaderboardTypeDefs';

const cmdDef: JSONCmd = {
  name: 'leaderboard',
  description: 'Leaderboard commands',
  options: [
    {
      type: 1,
      name: 'ranks',
      description: 'Show Leaderboard rankings',
      options: [
        {
          name: 'element',
          description: 'Select Element',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: LEADERBOARD_DAMAGE_TYPE_CHOICES,
        },
        {
          name: 'group_type',
          description: 'Select group type',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Solo', value: 'solo' },
            { name: 'Open', value: 'open' },
          ],
        },
      ],
    },
  ],
};
export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      preconditions: ['LBCacheCheck'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          async chatInputRun(interaction) {
            const element = interaction.options.getString('element', true) as LBElements;
            const groupType = interaction.options.getString(
              'group_type',
              true,
            ) as GroupCategoryType;
            await interaction.deferReply({
              ephemeral: true,
            });

            const embeds = await LeaderboardCache.generateEmbeds(element, groupType, 10);
            const pager = await viewBook(embeds);
            return pager(interaction);
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
