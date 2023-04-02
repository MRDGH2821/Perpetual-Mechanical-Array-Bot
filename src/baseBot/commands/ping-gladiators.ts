import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  MessageFlags,
  roleMention,
} from 'discord.js';
import { ChannelIds, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

@ApplyOptions<Command.Options>({
  name: 'ping-gladiators',
  description: 'Pings Gladiators in voting channel',
})
export default class GuildCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      preconditions: [['ModOnly', 'BattleCasterOnly']],
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        dm_permission: false,
        dmPermission: false,
        type: ApplicationCommandType.ChatInput,
        options: [
          {
            name: 'ping_archons',
            description: 'Should I ping archons too?',
            type: ApplicationCommandOptionType.Boolean,
          },
        ],
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const toPingArchons = interaction.options.getBoolean('ping_archons') || false;

    const voterChannel = interaction.guild?.channels.cache.get(ChannelIds.ARENA_OF_VOTERS);

    if (!voterChannel?.isTextBased()) {
      throw new Error('Cannot send message in non-text channel');
    }

    const content = `${roleMention(ROLE_IDS.OTHERS.GLADIATORS)}${
      toPingArchons ? roleMention(ROLE_IDS.OTHERS.ARCHONS) : ' '
    }`;

    voterChannel.send({
      content,
    });

    return interaction.reply({
      content: 'Will be pinged soon',
      flags: MessageFlags.Ephemeral,
    });
  }
}
