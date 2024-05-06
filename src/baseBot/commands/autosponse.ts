import { Subcommand } from '@sapphire/plugin-subcommands';
import { Time } from '@sapphire/time-utilities';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  MessageFlags,
  PermissionsBitField,
  time,
} from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';

const autoresponseChoices = [
  {
    name: 'TikTok',
    value: 'TIKTOK',
  },
  {
    name: 'Leaks',
    value: 'LEAKS',
  },
  {
    name: 'Fbi',
    value: 'FBI',
  },
  {
    name: 'Yoyoverse',
    value: 'YOYOVERSE',
  },
  {
    name: 'Baguette',
    value: 'BAGUETTE',
  },
];
const cmdDef: JSONCmd = {
  name: 'autoresponse',
  description: 'Autoresponse settings',
  dmPermission: false,
  defaultMemberPermissions: new PermissionsBitField(['ManageMessages', 'ManageGuild']).bitfield,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'disable',
      description: 'Disables an Auto response',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'Select which auto response to disable',
          type: ApplicationCommandOptionType.String,
          choices: autoresponseChoices,
          required: true,
        },
        {
          name: 'duration',
          description: 'For how many hours should this be disabled? (Default 24 hours)',
          type: ApplicationCommandOptionType.Integer,
          min_value: 0,
          minValue: 0,
          required: false,
        },
      ],
    },
    {
      name: 'enable',
      description: 'Enables an Auto response',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'Select which auto response to enable',
          type: ApplicationCommandOptionType.String,
          choices: autoresponseChoices,
          required: true,
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
      preconditions: ['ModOnly'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          chatInputRun: 'chatRun',
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun: 'chatRun',
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }

  public async chatRun(interaction: Subcommand.ChatInputCommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const name = interaction.options.getString('name', true);
    const hours = interaction.options.getInteger('duration') || 24;
    const subCommand = interaction.options.getSubcommand(true);
    function isToEnable() {
      return subCommand.toLowerCase().includes('enable');
    }
    process.env[`AUTORESPONSE_${name}`] = String(isToEnable());

    const content = isToEnable()
      ? `\`${name}\` autoresponse is now enabled.`
      : `${name} is now disabled for ${hours}h.\nIt will be enabled in ${time(
          new Date(hours * Time.Hour + Date.now()),
          'R',
        )} \n\nDo note that if the bot restarts, it will be enabled again irrespective of given duration`;

    await interaction.editReply({
      content,
      options: {
        flags: MessageFlags.Ephemeral,
      },
    });
    this.container.logger.debug(`AUTORESPONSE_${name} = `, process.env[`AUTORESPONSE_${name}`]);
    setTimeout(() => {
      process.env[`AUTORESPONSE_${name}`] = 'true';
    }, hours * Time.Hour);
  }
}
