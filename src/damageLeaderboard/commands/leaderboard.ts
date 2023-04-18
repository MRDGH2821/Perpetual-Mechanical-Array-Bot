import { Subcommand } from '@sapphire/plugin-subcommands';
import { Time } from '@sapphire/time-utilities';
import {
  ActionRowBuilder,
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Message,
  MessageFlags,
  ModalSubmitInteraction,
  TextInputStyle,
} from 'discord.js';
import { guildMessageIDsExtractor, isStaff, PMAEventHandler } from '../../baseBot/lib/Utilities';
import { ChannelIds, COLORS, ICONS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { parseTruthy, viewBook } from '../../lib/utils';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { LEADERBOARD_DAMAGE_TYPE_CHOICES } from '../lib/Constants';
import LeaderboardCache from '../lib/LeaderboardCache';
import { extractLinks, leaderboardProps, parseElement, parseGroupType } from '../lib/Utilities';
import type {
  GroupCategoryType,
  LBElements,
  LBRegistrationArgs,
} from '../typeDefs/leaderboardTypeDefs';

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

    return this.registerContestant(
      {
        contestant,
        element,
        groupType,
        proofMessage,
        score,
        shouldForceUpdate,
      },
      interaction,
    );
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

  // eslint-disable-next-line consistent-return
  public async registerContestant(
    args: LBRegistrationArgs,
    interaction:
      | Subcommand.ChatInputCommandInteraction
      | Subcommand.ContextMenuCommandInteraction
      | ModalSubmitInteraction,
  ) {
    const oldScoreData = LeaderboardCache.getScore(
      args.contestant.id,
      args.element,
      args.groupType,
    );
    const props = leaderboardProps(args.element);
    const assets = await this.extractData(args.proofMessage);
    const embed: APIEmbed = {
      title: '**Entry Verification**',
      color: props.color,
      thumbnail: {
        url: props.icon,
      },
      description: `**Contestant**: ${args.contestant} \`${args.contestant.tag}\` \n**Category**: [${args.element}] ${props.name} \n**Group**: ${args.groupType} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proofMessage.url}`,
      fields: [],
      image: {
        url: '',
      },
      video: {
        url: '',
      },
    };

    if (args.shouldForceUpdate === false && oldScoreData && oldScoreData!.score > args.score) {
      return interaction.editReply({
        embeds: [
          {
            color: COLORS.ERROR,
            title: '**Higher score detected!**',
            thumbnail: { url: ICONS.CROSS_MARK },
            description:
              'A higher score for same contestant was detected in leaderboard thus rejecting submission.',
            fields: [
              {
                name: 'Score in Leaderboard',
                value: `[${oldScoreData.score}](${oldScoreData.proof})`,
              },
              {
                name: 'Score input',
                value: `[${args.score}](${args.proofMessage.url})`,
              },
            ],
          },
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>({}).addComponents([
            new ButtonBuilder({
              customId: 'old_proof',
              label: 'Old Proof',
              style: ButtonStyle.Link,
              url: oldScoreData.proof,
            }),
            new ButtonBuilder({
              customId: 'new_proof',
              label: 'New Proof',
              style: ButtonStyle.Link,
              url: args.proofMessage.url,
            }),
          ]),
        ],
      });
    }
    try {
      const { author, content, attachments } = args.proofMessage;
      const firstAtt = attachments.first();

      const proofURL = firstAtt?.url || firstAtt?.proxyURL || assets.possibleLinks![0] || '';

      embed.image = {
        url: proofURL,
      };
      embed.video = {
        url: proofURL,
      };
      embed.fields?.push(
        {
          name: '**Auto Verification**',
          value: `**Contestant**: ${
            author.id === args.contestant.id
              ? 'Verified'
              : `Cannot Verify (most likely submission done on behalf of ${
                args.contestant?.tag
              } by ${author.tag})\n**Score**: ${
                content.match(`${args.score}`)?.length
                  ? 'Verified'
                  : "Cannot Verify (most likely because contestant didn't put score as text while uploading proof)"
              }`
          }`,
        },
        {
          name: '**Attachments direct link**',
          value: `Link 1: ${firstAtt?.url || 'Failed to get attachment url'}\nLink 2: ${
            firstAtt?.proxyURL || 'Failed to get attachment url'
          }\nOther links: ${assets.possibleLinks?.toString()}`,
        },
      );

      if (oldScoreData) {
        const diff = Number(args.score) - Number(oldScoreData.score);

        const diffSign = diff < 0 ? '-' : '+';

        embed.fields?.push({
          name: '**Previous Score**',
          value: `[${oldScoreData.score}](${oldScoreData.proof}) \nA difference of ${diffSign} ${diff}`,
        });
      }

      const approveRow = new ActionRowBuilder<ButtonBuilder>({
        type: ComponentType.Button,
        components: [
          new ButtonBuilder({
            customId: 'accepted',
            label: 'Accept',
            emoji: '👍',
            style: ButtonStyle.Success,
          }),
          new ButtonBuilder({
            customId: 'declined',
            label: 'Decline',
            emoji: '👎',
            style: ButtonStyle.Danger,
          }),
          new ButtonBuilder({
            customId: 'show_proof',
            label: 'Show Proof',
            emoji: '🧾',
            style: ButtonStyle.Link,
            url: proofURL,
          }),
          new ButtonBuilder({
            customId: 'show_message',
            label: 'Jump to message',
            emoji: '💬',
            url: args.proofMessage.url,
          }),
        ],
      });

      return await interaction
        .editReply({
          embeds: [embed],
          components: [approveRow],
        })
        .then((msg) => {
          interaction.followUp({
            content:
              firstAtt?.url ||
              assets.possibleLinks![0] ||
              "No URLs/Videos found in contestant's message",
          });

          return msg.awaitMessageComponent({
            componentType: ComponentType.Button,
            dispose: true,
            async filter(itx) {
              await itx.deferUpdate();
              if (!isStaff(itx.member!)) {
                itx.followUp({
                  content: 'Ping a mod to get approval!',
                  flags: MessageFlags.Ephemeral,
                });
              }
              return isStaff(itx.member!);
            },
          });
        })
        .then((btnCtx) => {
          if (btnCtx.customId === 'accepted') {
            embed.thumbnail = {
              url: ICONS.CHECK_MARK,
            };
            embed.title = '**Submission Accepted!**';
            embed.color = COLORS.SUCCESS;
            PMAEventHandler.emit('LBRegister', args);
            return btnCtx.editReply({
              embeds: [embed],
              components: [],
            });
          }
          embed.thumbnail = {
            url: ICONS.CROSS_MARK,
          };
          embed.title = '**Submission Rejected!**';
          embed.color = COLORS.ERROR;

          return btnCtx.editReply({
            embeds: [embed],
            components: [],
          });
        });
    } catch (e) {
      this.container.logger.error(e);
    }
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
