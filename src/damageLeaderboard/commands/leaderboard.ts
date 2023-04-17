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
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'register',
      description: 'Register damage score',
      options: [
        {
          name: 'contestant',
          description: 'Who made the score? (User ID can also be put)',
          required: true,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'element',
          description: 'Which element was used?',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: LEADERBOARD_DAMAGE_TYPE_CHOICES,
        },
        {
          name: 'group_type',
          description: 'Whether this score was made solo or not',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Solo', value: 'solo' },
            { name: 'Open', value: 'open' },
          ],
        },
        {
          name: 'score',
          description: 'Score i.e. Damage value',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: 'proof_link',
          description: 'Upload proof on traveler showcase channel & copy link to message',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'force_update',
          description: 'Update the score forcefully even if lower (default false)',
          type: ApplicationCommandOptionType.Boolean,
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
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun: 'parseRegistration',
        },
      ],
    });
  }

  public async parseRegistration(interaction: Subcommand.ChatInputCommandInteraction) {
    const contestant = interaction.options.getUser('contestant', true);
    const element = interaction.options.getString('element', true) as LBElements;
    const groupType = interaction.options.getString('group_type') as GroupCategoryType;
    const score = interaction.options.getInteger('score', true);
    const proofLink = interaction.options.getString('proof_link', true);
    const shouldForceUpdate = interaction.options.getBoolean('force_update') || false;

    const lbChannel = await interaction.guild?.channels.fetch(ChannelIds.SHOWCASE);
    if (!lbChannel?.isTextBased()) {
      throw new Error('Cannot fetch showcase text channel');
    }
    const proofMessage = await lbChannel.messages.fetch(
      guildMessageIDsExtractor(proofLink).messageId,
    );

    return this.registerContestant({
      contestant,
      element,
      groupType,
      proofMessage,
      score,
      shouldForceUpdate,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async extractData(message: Message) {
    const attachment = message.attachments.first();
    const contestant = message.author;
    const { content } = message;
    const possibleScore = content.search(/\d/gimu);

    return {
      contestant,
      url: attachment?.url,
      proxyUrl: attachment?.proxyURL,
      possibleScore,
    };
  }
      ],
    });
  }


  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
