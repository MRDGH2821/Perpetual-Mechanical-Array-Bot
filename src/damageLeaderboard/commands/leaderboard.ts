import { Subcommand } from '@sapphire/plugin-subcommands';
import { Time } from '@sapphire/time-utilities';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  Message,
  MessageFlags,
  ModalSubmitInteraction,
  TextInputStyle,
  channelMention,
  time,
  type APIEmbed,
} from 'discord.js';
import { PMAEventHandler, guildMessageIDsExtractor, isStaff } from '../../baseBot/lib/Utilities';
import { COLORS, ChannelIds, ICONS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { parseTruthy, viewBook } from '../../lib/utils';
import { LBFJobSchedule, LBUJobSchedule } from '../../scheduledTasks';
import type { ButtonActionRow, JSONCmd } from '../../typeDefs/typeDefs';
import { LEADERBOARD_DAMAGE_TYPE_CHOICES } from '../lib/Constants';
import LeaderboardCache from '../lib/LeaderboardCache';
import {
  extractLinks,
  leaderboardProps,
  parseDamageCategory,
  parseGroupType,
  parseLBElement,
  proofLinkValidator,
} from '../lib/Utilities';
import type { LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

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
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'when-refresh',
      description: 'When will the leaderboard refresh?',
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
            const element = parseLBElement(interaction.options.getString('element', true));
            const groupType = parseGroupType(interaction.options.getString('group_type', true));
            await interaction.deferReply({
              ephemeral: true,
            });

            const embeds = await LeaderboardCache.generateEmbeds(element, groupType, 5);
            const pager = await viewBook(embeds);
            return pager(interaction);
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun: 'parseRegistration',
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',
          chatInputRun(interaction) {
            const forumPublish = LBFJobSchedule.nextInvocation();
            const lbUpdate = LBUJobSchedule.nextInvocation();
            return interaction.reply({
              embeds: [
                {
                  color: COLORS.EMBED_COLOR,
                  title: 'Leaderboard Refresh Schedule',
                  description: `Next refresh is scheduled at:\n\n**Weekly Leaderboard**: ${time(forumPublish)} (${time(
                    forumPublish,
                    'R',
                  )}) \n**Summary Leaderboard**: ${time(lbUpdate)} (${time(lbUpdate, 'R')})`,
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

  // eslint-disable-next-line class-methods-use-this
  private validateProofLink(link: string): boolean {
    try {
      proofLinkValidator.parse(link);
      return true;
    } catch {
      return false;
    }
  }

  public async parseRegistration(interaction: Subcommand.ChatInputCommandInteraction) {
    const contestant = interaction.options.getUser('contestant', true);
    const element = parseLBElement(interaction.options.getString('element', true));
    const groupType = parseGroupType(interaction.options.getString('group_type', true));
    const score = interaction.options.getInteger('score', true);
    const proofLink = interaction.options.getString('proof_link', true);
    const shouldForceUpdate = interaction.options.getBoolean('force_update') || false;

    if (!this.validateProofLink(proofLink)) {
      return interaction.reply({
        content: 'Invalid proof link',
        flags: MessageFlags.Ephemeral,
      });
    }

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
    const possibleScores = content.match(/\d+/gimu);
    const possibleGroupTypes = content.match(/(solo)|(open)/gimu);
    const possibleElements = content.match(
      /(anemo)|(geo)|(electro)|(dendro)|(hydro)|(uni|universal)/gimu,
    );

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
              required: false,
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
      .then(async (modalCtx) => {
        const score = modalCtx.fields.getTextInputValue('score');
        const element = parseLBElement(modalCtx.fields.getTextInputValue('element'));
        const groupType = parseGroupType(modalCtx.fields.getTextInputValue('group_type'));
        const shouldForceUpdate = parseTruthy(modalCtx.fields.getTextInputValue('force_update')) || false;
        await modalCtx.deferReply({
          ephemeral: true,
        });
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

  public async registerContestant(
    args: LBRegistrationArgs,
    interaction:
    | Subcommand.ChatInputCommandInteraction
    | Subcommand.ContextMenuCommandInteraction
    | ModalSubmitInteraction,
  ) {
    if (!interaction.deferred) {
      await interaction.deferReply();
    }

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

    const ids = guildMessageIDsExtractor(args.proofMessage.url);

    if (ids.channelId !== ChannelIds.SHOWCASE) {
      return interaction.editReply({
        content: `Proof Link should be from ${channelMention(ChannelIds.SHOWCASE)}`,
      });
    }

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
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'Old Proof',
                style: ButtonStyle.Link,
                url: oldScoreData.proof,
              },
              {
                type: ComponentType.Button,
                label: 'New Proof',
                style: ButtonStyle.Link,
                url: args.proofMessage.url,
              },
            ],
          },
        ],
      });
    }
    try {
      const { author, content, attachments } = args.proofMessage;
      const firstAtt = attachments.first();

      const proofURL = firstAtt?.url
        || firstAtt?.proxyURL
        || (assets.possibleLinks ? assets.possibleLinks[0] : 'https://youtube.com');

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
              : `Cannot Verify (most likely submission done on behalf of ${args.contestant
                ?.tag} by ${author.tag})\n**Score**: ${
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

      const linkRow: ButtonActionRow = {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            label: 'Show Proof',
            emoji: '🧾',
            style: ButtonStyle.Link,
            url: proofURL,
          },
          {
            type: ComponentType.Button,
            label: 'Jump to message',
            emoji: '💬',
            style: ButtonStyle.Link,
            url: args.proofMessage.url,
          },
        ],
      };

      const approveRow: ButtonActionRow = {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            customId: 'accepted',
            label: 'Accept',
            emoji: '👍',
            style: ButtonStyle.Success,
          },
          {
            type: ComponentType.Button,
            customId: 'declined',
            label: 'Decline',
            emoji: '👎',
            style: ButtonStyle.Danger,
          },
        ],
      };

      return await interaction
        .editReply({
          embeds: [embed],
          components: [approveRow, linkRow],
        })
        .then((msg) => {
          interaction.followUp({
            content:
              firstAtt?.url
              || (assets.possibleLinks
                ? assets.possibleLinks[0]
                : "No URLs/Videos found in contestant's message"),
            flags: MessageFlags.Ephemeral,
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
            const successEmbed: APIEmbed = {
              ...embed,
              thumbnail: {
                url: ICONS.CHECK_MARK,
              },
              title: '**Submission Accepted!**',
              color: COLORS.SUCCESS,
            };
            return LeaderboardCache.registerScore({
              elementCategory: parseDamageCategory(args.element),
              proof: args.proofMessage.url,
              score: args.score,
              typeCategory: parseGroupType(args.groupType),
              userID: args.contestant.id,
            }).then(() => {
              PMAEventHandler.emit('LBPostRegister', args, oldScoreData);
              return btnCtx.editReply({
                embeds: [successEmbed],
                components: [linkRow],
              });
            });
          }
          const failEmbed: APIEmbed = {
            ...embed,
            thumbnail: {
              url: ICONS.CROSS_MARK,
            },
            title: '**Submission Rejected!**',
            color: COLORS.ERROR,
          };
          return btnCtx.editReply({
            embeds: [failEmbed],
            components: [linkRow],
          });
        });
    } catch (e) {
      this.container.logger.error(e);

      return interaction.editReply({
        embeds: [
          {
            title: '**An error occurred**',
            description: `There was an error while registration:\n\n${e}`,
          },
        ],
        files: [
          {
            attachment: `${e}`,
            name: 'Error while registering user.txt',
          },
        ],
      });
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
