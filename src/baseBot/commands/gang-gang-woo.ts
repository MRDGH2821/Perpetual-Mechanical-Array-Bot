import { isGuildMember } from '@sapphire/discord.js-utilities';
import { Subcommand } from '@sapphire/plugin-subcommands';
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  Collection,
  ComponentType,
  GuildMember,
  MessageFlags,
} from 'discord.js';
import { COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { isStaff } from '../lib/Utilities';

const cmdDef: JSONCmd = {
  name: 'gang-gang-woo',
  description: 'Gang Gang Woo!',
  options: [
    {
      type: 1,
      name: 'current',
      description: 'Check who are the current Gang Gang Woo!',
    },
    {
      type: 1,
      name: 'remove-members',
      description: 'Removes members from Gang Gang Woo role',
    },
    {
      type: 1,
      name: 'add-members',
      description: 'Adds Gang Gang Woo role to members',
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'member1',
          description: 'Member no.1 to add Gang Gang Woo role to',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.User,
          name: 'member2',
          description: 'Member no.2 to add Gang Gang Woo role to',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.User,
          name: 'member3',
          description: 'Member no.3 to add Gang Gang Woo role to',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.User,
          name: 'member4',
          description: 'Member no.4 to add Gang Gang Woo role to',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.User,
          name: 'member5',
          description: 'Member no.5 to add Gang Gang Woo role to',
          required: true,
        },
      ],
    },
  ],
};
export default class UserCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          chatInputRun: 'gangCurrent',
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun: 'gangRemove',
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',
          chatInputRun: 'gangAdd',
        },
      ],
    });
  }

  public gangMembers(format: 'string' | 'object' = 'string') {
    return this.container.client.guilds
      .fetch(EnvConfig.guildId)
      .then((guild) => guild.roles.fetch(ROLE_IDS.OTHERS.GANG_GANG_WOO))
      .then((role) => {
        if (!role) {
          return 'No members found.';
        }

        if (format === 'string') {
          return role.members.map((member) => `${member} \`${member.user.tag}\``).join('\n');
        }
        return role.members;
      });
  }

  public async gangCurrent(interaction: Subcommand.ChatInputCommandInteraction) {
    const gang = (await this.gangMembers('string')) as string;

    return interaction.reply({
      embeds: [
        {
          title: 'Gang Gang Woo!',
          description: 'Here are the current members of Gang Gang Woo:',
          color: COLORS.EMBED_COLOR,
          fields: [
            {
              name: 'Members',
              value: gang,
            },
          ],
        },
      ],
    });
  }

  public async gangRemove(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!isStaff(interaction.member)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral,
      });
    }
    const gangMembers = (await this.gangMembers('object')) as Collection<string, GuildMember>;
    if (gangMembers.size === 0) {
      return interaction.reply({
        content: 'No members found.',
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction
      .reply({
        content: 'Are you sure to remove all members from Gang Gang Woo role?',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'Yes',
                style: ButtonStyle.Success,
                customId: 'yes',
              },
              {
                type: ComponentType.Button,
                label: 'No',
                style: ButtonStyle.Danger,
                customId: 'no',
              },
            ],
          },
        ],
        fetchReply: true,
      })
      .then((msg) =>
        msg.awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          componentType: ComponentType.Button,
          dispose: true,
        }),
      )
      .then((i) => {
        if (i.customId === 'yes') {
          const memberIDs = gangMembers.map((member) => member.id);
          gangMembers.forEach((member) => member.roles.remove(ROLE_IDS.OTHERS.GANG_GANG_WOO));
          return interaction.editReply({
            content: 'Removed all members from Gang Gang Woo role.',
            components: [],
            files: [
              {
                name: `gang-gang-woo backup ${new Date().toTimeString()}.json`,
                attachment: Buffer.from(memberIDs.toString()),
              },
            ],
          });
        }
        return interaction.editReply({
          content: 'Cancelled.',
          components: [],
        });
      });
  }

  // eslint-disable-next-line class-methods-use-this
  public async gangAdd(interaction: Subcommand.ChatInputCommandInteraction) {
    const members = [
      interaction.options.getMember('member1'),
      interaction.options.getMember('member2'),
      interaction.options.getMember('member3'),
      interaction.options.getMember('member4'),
      interaction.options.getMember('member5'),
    ];

    const validatedMembers = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const member of members) {
      if (isGuildMember(member)) {
        validatedMembers.push(member);
      }
    }

    if (validatedMembers.length !== 5) {
      return interaction.reply({
        content: 'Invalid members provided.',
        flags: MessageFlags.Ephemeral,
        files: [
          {
            name: 'Input Members.json',
            attachment: Buffer.from(members.toString()),
          },
          {
            name: 'Validated Members.json',
            attachment: Buffer.from(
              validatedMembers.map((member) => ({ id: member.id })).toString(),
            ),
          },
        ],
      });
    }

    validatedMembers.forEach((member) => member.roles.add(ROLE_IDS.OTHERS.GANG_GANG_WOO));

    return interaction.reply({
      embeds: [
        {
          color: COLORS.EMBED_COLOR,
          title: 'Added members in Gang Gang Woo!',
          description: `The following members are the new Gang Gang Woo!\n\n${validatedMembers
            .map((member) => `${member} \`${member.user.tag}\``)
            .join('\n')}`,
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
