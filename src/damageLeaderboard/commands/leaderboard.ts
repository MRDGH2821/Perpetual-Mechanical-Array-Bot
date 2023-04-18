import { Subcommand } from '@sapphire/plugin-subcommands';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  Message,
  User,
} from 'discord.js';
import { guildMessageIDsExtractor } from '../../baseBot/lib/Utilities';
import { ChannelIds } from '../../lib/Constants';
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
    const possibleScores = content.match(/\d/gimu);
    const possibleGroupTypes = content.match(/(solo)|(open)/gimu);
    const possibleElements = content.match(/(anemo)|(geo)|(electro)|(dendro)|(uni|universal))/gimu);

    return {
      contestant,
      url: attachment?.url,
      proxyUrl: attachment?.proxyURL,
      possibleScore: possibleScores ? possibleScores[0] : undefined,
      possibleGroupType: possibleGroupTypes ? possibleGroupTypes[0] : undefined,
      possibleElement: possibleElements ? possibleElements[0] : undefined,
      possibleLinks: extractLinks(content),
    };
  }

  public override async contextMenuRun(interaction: Subcommand.ContextMenuCommandInteraction) {
    if (!interaction.isMessageContextMenuCommand()) {
      throw new Error('No message found');
    }

    const message = interaction.targetMessage;

    const contestant = message.author;

    const assets = await this.extractData(message);

    await interaction.showModal({
      title: `Registering user ${contestant.tag}`,
      customId: 'registration_form',
      custom_id: 'registration_form',
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              customId: 'score',
              label: 'Score?',
              style: TextInputStyle.Short,
              required: true,
              placeholder: 'Insert score',
              value: assets.possibleScore,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              customId: 'element',
              label: 'Element?',
              style: TextInputStyle.Short,
              required: true,
              placeholder: 'Uni/Anemo/Geo/Electro/Dendro/Hydro/Pyro/Cryo',
              value: assets.possibleElement,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              customId: 'group_type',
              label: 'Did solo or open?',
              style: TextInputStyle.Short,
              required: true,
              placeholder: 'Solo/Open',
              value: assets.possibleGroupType,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              customId: 'force_update',
              label: 'Force update score?',
              style: TextInputStyle.Short,
              placeholder: 'Yes/No/Y/N (Default no)',
            },
          ],
        },
      ],
    });

    return interaction
      .awaitModalSubmit({
        time: 3 * Time.Minute,
        async filter(itx) {
          return itx.user.id === interaction.user.id;
        },
      })
      .then((modalCtx) => {
        const score = modalCtx.fields.getTextInputValue('score');
        const element = parseElement(modalCtx.fields.getTextInputValue('element'));
        const groupType = parseGroupType(modalCtx.fields.getTextInputValue('group_type'));
        const shouldForceUpdate =
          parseTruthy(modalCtx.fields.getTextInputValue('force_update')) || false;

        return this.registerContestant(
          {
            contestant,
            element,
            groupType,
            proofMessage: message,
            score: parseInt(score, 10),
            shouldForceUpdate,
          },
          modalCtx,
        );
      });
  }


  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
    registry.registerContextMenuCommand(
      {
        name: 'Register Score for leaderboard',
        type: ApplicationCommandType.Message,
        dm_permission: false,
        dmPermission: false,
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }
}
