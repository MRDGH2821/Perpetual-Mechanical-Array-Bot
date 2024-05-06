// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */
import {
  type ChatInputOrContextMenuCommandInteraction,
  HttpUrlRegex,
  isGuildMember,
} from '@sapphire/discord.js-utilities';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { pickRandom } from '@sapphire/utilities';
import type { GuildMember, Message, SelectMenuComponentOptionData } from 'discord.js';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  PermissionFlagsBits,
} from 'discord.js';
import HallOfFameCache from '../../hallOfFame/lib/HallOfFameCache';
import { ChannelIds, COLORS, EMOJIS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import AssignRoles from '../lib/AssignRoles';
import { guildMessageIDsExtractor, isStaff } from '../lib/Utilities';

const cmdDef: JSONCmd = {
  name: 'give-role',
  description: 'Gives role to selected user',
  defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: 1,
      name: 'one',
      description: 'Give one role!',
      options: [
        {
          name: 'member',
          description: 'Select member',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'role',
          description: 'Select Role',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: 'proof_link',
          description: 'Message link as proof of achievement',
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
    {
      type: 1,
      name: 'multi',
      description: 'Give multiple roles!',
      options: [
        {
          name: 'member',
          description: 'Select member',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'proof_link',
          description: 'Message link as proof of achievement',
          type: ApplicationCommandOptionType.String,
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
      requiredUserPermissions: PermissionFlagsBits.ManageRoles,
      requiredClientPermissions: PermissionFlagsBits.ManageRoles,
      preconditions: ['ModOnly'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });

    registry.registerContextMenuCommand(
      {
        name: 'Give Roles',
        type: ApplicationCommandType.Message,
        dmPermission: false,
        dm_permission: false,
        defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  private async messageCrawler(member: GuildMember) {
    const { client } = member;

    const guild = await (await client.guilds.fetch()).get(EnvConfig.guildId)?.fetch();
    if (!guild) {
      throw new Error('Cannot fetch guild');
    }
    const roleAppChannel = await (
      await guild.channels.fetch(ChannelIds.ROLE_APPLICATION, {
        force: true,
      })
    )?.fetch();

    if (!roleAppChannel?.isTextBased()) {
      throw new Error('Cannot fetch Role Applications channel');
    }

    const messages = await roleAppChannel.messages.fetch({
      limit: 20,
    });

    const memberMessages = messages.filter((msg) => msg.author.id === member.id);

    memberMessages.sort((msg1, msg2) => msg2.createdTimestamp - msg1.createdTimestamp);
    const messagesWithAttachments = memberMessages.filter(
      (msg) => msg.attachments.size > 0 || HttpUrlRegex.test(msg.content),
    );
    return messagesWithAttachments.first();
  }

  private async shouldShowAllRoles(
    interaction: ChatInputOrContextMenuCommandInteraction,
  ): Promise<boolean> {
    return interaction
      .editReply({
        embeds: [
          {
            color: COLORS.EMBED_COLOR,
            title: 'Should I show all roles?',
            description: 'Should I show all roles? \nOr hide already assigned roles?',
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'Show All Roles',
                style: ButtonStyle.Secondary,
                customId: 'show_all_roles',
              },
              {
                type: ComponentType.Button,
                label: 'Hide Assigned Roles',
                style: ButtonStyle.Success,
                customId: 'hide_assigned_roles',
              },
            ],
          },
        ],
      })
      .then(async (msg) =>
        msg.awaitMessageComponent({
          componentType: ComponentType.Button,
          dispose: true,
          async filter(i) {
            await i.deferUpdate();
            if (i.member) {
              return isStaff(i.member);
            }

            return false;
          },
        }),
      )
      .then((btnCtx) => btnCtx.customId === 'show_all_roles');
  }

  private async selectRoles(
    interaction: ChatInputOrContextMenuCommandInteraction,
    member: GuildMember,
  ) {
    await interaction.editReply({
      embeds: [
        {
          color: COLORS.EMBED_COLOR,
          description: 'Loading...',
        },
      ],
    });

    const showAllRoles = await this.shouldShowAllRoles(interaction);

    const memberRoles = member.roles.cache;
    const roles = await interaction.guild?.roles.fetch();
    let selectedRoles: string[] = [];
    if (!roles) {
      throw new Error('Fetching roles failed');
    }
    const crownData = HallOfFameCache.isUserInCache(member.id);
    const optionsArr: SelectMenuComponentOptionData[] = [
      {
        description: 'Completed a Spiral Abyss Criteria',
        emoji: pickRandom([EMOJIS.DullBlade, EMOJIS.DvalinHYPE, '🌀', '⚔️', '😎']),
        label: 'Triumphed over Abyss',
        value: ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
      },
      {
        default: memberRoles.has(ROLE_IDS.REPUTATION.MONDSTADT),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '🕊️',
        label: roles.get(ROLE_IDS.REPUTATION.MONDSTADT)?.name || 'Megastar in Mondstadt',
        value: ROLE_IDS.REPUTATION.MONDSTADT,
      },
      {
        default: memberRoles.has(ROLE_IDS.REPUTATION.LIYUE),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '⚖️',
        label: roles.get(ROLE_IDS.REPUTATION.LIYUE)?.name || 'Legend in Liyue',
        value: ROLE_IDS.REPUTATION.LIYUE,
      },
      {
        default: memberRoles.has(ROLE_IDS.REPUTATION.INAZUMA),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '⛩️',
        label: roles.get(ROLE_IDS.REPUTATION.INAZUMA)?.name || 'Illustrious in Inazuma',
        value: ROLE_IDS.REPUTATION.INAZUMA,
      },
      {
        default: memberRoles.has(ROLE_IDS.REPUTATION.SUMERU),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '🌴',
        label: roles.get(ROLE_IDS.REPUTATION.SUMERU)?.name || 'Scholarly in Sumeru',
        value: ROLE_IDS.REPUTATION.SUMERU,
      },
      {
        default: crownData.anemo[3],
        description: 'Crowned their Anemo Traveler',
        emoji: EMOJIS.Anemo || '🌪️',
        label: roles.get(ROLE_IDS.CROWN.ANEMO)?.name || 'Anemo Crown Role',
        value: ROLE_IDS.CROWN.ANEMO,
      },
      {
        default: crownData.geo[3],
        description: 'Crowned their Geo Traveler',
        emoji: EMOJIS.Geo || '🪨',
        label: roles.get(ROLE_IDS.CROWN.GEO)?.name || 'Geo Crown Role',
        value: ROLE_IDS.CROWN.GEO,
      },
      {
        default: crownData.electro[3],
        description: 'Crowned their Electro Traveler',
        emoji: EMOJIS.Electro || '⚡',
        label: roles.get(ROLE_IDS.CROWN.ELECTRO)?.name || 'Electro Crown Role',
        value: ROLE_IDS.CROWN.ELECTRO,
      },
      {
        default: crownData.dendro[3],
        description: 'Crowned their Dendro Traveler',
        emoji: EMOJIS.Dendro || '🌲',
        label: roles.get(ROLE_IDS.CROWN.DENDRO)?.name || 'Dendro Crown Role',
        value: ROLE_IDS.CROWN.DENDRO,
      },
      {
        default: crownData.hydro[3],
        description: 'Crowned their Hydro Traveler',
        emoji: EMOJIS.Hydro || '🌊',
        label: roles.get(ROLE_IDS.CROWN.HYDRO)?.name || 'Hydro Crown Role',
        value: ROLE_IDS.CROWN.HYDRO,
      },
      {
        default: memberRoles.has(ROLE_IDS.CROWN.UNALIGNED),
        description: 'Crowned their Unaligned Traveler',
        emoji: pickRandom(['👑', '✨']),
        label: roles.get(ROLE_IDS.CROWN.UNALIGNED)?.name || 'Unaligned Crown Role',
        value: ROLE_IDS.CROWN.UNALIGNED,
      },
      {
        default: memberRoles.has(ROLE_IDS.OTHERS.WHALE),
        description: 'Spent $1500, or have c6 5* chars or r5 5* weapons',
        emoji: pickRandom(['🐋', '🐳', '💰']),
        label: roles.get(ROLE_IDS.OTHERS.WHALE)?.name || 'Whale Role',
        value: ROLE_IDS.OTHERS.WHALE,
      },
    ].filter((option) => (showAllRoles ? true : !option.default));
    await interaction
      .editReply({
        embeds: [
          {
            title: '**Select Roles**',
            description: `Select roles to give to ${member}. The amount of EXP will be calculated in end.`,
            color: COLORS.EMBED_COLOR,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.StringSelect,
                customId: 'selected_roles',
                minValues: 1,
                maxValues: optionsArr.length,
                options: optionsArr,
              },
            ],
          },
        ],
        options: {
          fetchReply: true,
        },
      })
      .then((msg) =>
        msg.awaitMessageComponent({
          componentType: ComponentType.StringSelect,
          dispose: true,
          async filter(i) {
            await i.deferUpdate();
            if (i.member) {
              return isStaff(i.member);
            }
            return false;
          },
        }),
      )
      .then((selectCtx) => {
        if (!selectCtx.isStringSelectMenu()) return 0;
        const { values } = selectCtx;
        selectedRoles = selectedRoles.concat(values).flat();
        return selectedRoles;
      });

    return selectedRoles;
  }

  public async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction) {
    await interaction.deferReply();
    let member = interaction.options.getMember('member');
    const proofLink = interaction.options.getString('proof_link');

    if (!member || !isGuildMember(member)) {
      throw new Error('Cannot fetch Member');
    }

    member = await member.fetch(true);
    if (!member) {
      throw new Error('Cannot fetch Member');
    }

    let message: Message | null | undefined;
    if (proofLink) {
      const ids = guildMessageIDsExtractor(proofLink);
      const channel = await interaction.guild?.channels.fetch(ids.channelId);
      if (channel?.isTextBased()) {
        message = await channel.messages.fetch(ids.messageId);
      }
    } else {
      message = await this.messageCrawler(member);
    }

    const selectedRole = interaction.options.getString('role');
    const selectedRoles = [];

    if (selectedRole) {
      selectedRoles.push(selectedRole);
    }

    if (interaction.options.getSubcommand() === 'multi') {
      const moreRoles = await this.selectRoles(interaction, member);
      selectedRoles.push(...moreRoles);
    }

    return new AssignRoles({
      interaction,
      member,
      message,
      selectedRolesIDs: selectedRoles,
    }).awardRoles();
  }

  public override async contextMenuRun(interaction: Subcommand.ContextMenuCommandInteraction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });
    if (!interaction.isMessageContextMenuCommand()) return;
    const message = interaction.targetMessage;
    const { member } = message;
    if (!member) {
      throw new Error('Cannot Fetch Member');
    }

    const selectedRolesIDs = await this.selectRoles(interaction, member);
    const roleAssigner = new AssignRoles({
      interaction,
      member,
      message,
      selectedRolesIDs,
    });

    roleAssigner.awardRoles();
  }
}
