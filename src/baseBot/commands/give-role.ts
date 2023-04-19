/* eslint-disable class-methods-use-this */
import {
  isGuildMember,
  type ChatInputOrContextMenuCommandInteraction,
} from '@sapphire/discord.js-utilities';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { pickRandom } from '@sapphire/utilities';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  GuildMember,
  Message,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  type SelectMenuComponentOptionData,
} from 'discord.js';
import { COLORS, ChannelIds, EMOJIS, ROLE_IDS } from '../../lib/Constants';
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
          chatInputRun: 'chatInputGet',
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun: 'chatInputGet',
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });

    registry.registerContextMenuCommand(
      (builder) => {
        builder
          .setName('Give Roles')
          .setType(ApplicationCommandType.Message)
          .setDMPermission(false)
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);
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
    return memberMessages.first();
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

    const memberRoles = member.roles.cache;
    const roles = interaction.guild?.roles.cache;
    let selectedRoles: string[] = [];
    if (!roles) {
      throw new Error('Fetching roles failed');
    }
    const optionsArr: SelectMenuComponentOptionData[] = [
      {
        default: memberRoles.has(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER),
        description: 'Completed Spiral Abyss 36/36 using Traveler',
        emoji: pickRandom([EMOJIS.DvalinHYPE, '😎']),
        label: roles.get(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER)?.name || 'Abyssal Traveler',
        value: ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
      },
      {
        default: memberRoles.has(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR),
        description: '36/36 with 3 different Traveler elements ',
        emoji: '🌀',
        label: roles.get(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR)?.name || 'Abyssal Conqueror',
        value: ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
      },
      {
        // default: memberRoles.has(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN),
        description: '36/36 using 4 distinct Traveler elements & 4 distinct teams ',
        emoji: pickRandom([EMOJIS.DullBlade, '⚔️']),
        label: roles.get(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)?.name || 'Abyssal Sovereign',
        value: ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
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
        description: 'Crowned their Anemo Traveler',
        emoji: EMOJIS.Anemo || '🌪️',
        label: roles.get(ROLE_IDS.CROWN.ANEMO)?.name || 'Anemo Crown Role',
        value: ROLE_IDS.CROWN.ANEMO,
      },
      {
        description: 'Crowned their Geo Traveler',
        emoji: EMOJIS.Geo || '🪨',
        label: roles.get(ROLE_IDS.CROWN.GEO)?.name || 'Geo Crown Role',
        value: ROLE_IDS.CROWN.GEO,
      },
      {
        description: 'Crowned their Electro Traveler',
        emoji: EMOJIS.Electro || '⚡',
        label: roles.get(ROLE_IDS.CROWN.ELECTRO)?.name || 'Electro Crown Role',
        value: ROLE_IDS.CROWN.ELECTRO,
      },
      {
        description: 'Crowned their Dendro Traveler',
        emoji: EMOJIS.Dendro || '🌲',
        label: roles.get(ROLE_IDS.CROWN.DENDRO)?.name || 'Dendro Crown Role',
        value: ROLE_IDS.CROWN.DENDRO,
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
    ].filter((option) => {
      // if option is crown role
      if (Object.values(ROLE_IDS.CROWN).map(String).includes(option.value)) {
        // hide unaligned crown role once obtained
        return !(option.value === ROLE_IDS.CROWN.UNALIGNED && option.default === true);
      }
      // if option is spiral abyss role
      if (Object.values(ROLE_IDS.SpiralAbyss).map(String).includes(option.value)) {
        // do not hide the role
        return true;
      }
      // return rest of the options
      return !memberRoles.has(option.value);
    });
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
              new StringSelectMenuBuilder({
                options: optionsArr,
              })
                .setCustomId('selected_roles')
                .setMinValues(1)
                .setMaxValues(optionsArr.length),
            ],
          },
        ],
        options: {
          fetchReply: true,
        },
      })
      .then(async (msg) => {
        await msg
          .awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            dispose: true,
            async filter(i) {
              await i.deferUpdate();
              if (i.member) {
                return isStaff(i.member);
              }
              return false;
            },
          })
          .then((selectCtx) => {
            if (!selectCtx.isStringSelectMenu()) return;
            const { values } = selectCtx;
            selectedRoles = selectedRoles.concat(values).flat();
          });
      });

    return selectedRoles;
  }

  public async chatInputGet(interaction: Subcommand.ChatInputCommandInteraction) {
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
        message = channel.messages.resolve(ids.messageId);
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
