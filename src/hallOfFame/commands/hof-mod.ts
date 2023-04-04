import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType, ChannelType, MessageFlags } from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';

const cmdDef: JSONCmd = {
  name: 'hof-mod',
  description: 'Hall of Fame mod only commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Hall of Fame cache',
    },
    {
      type: 1,
      name: 'publish',
      description: 'Publishes the names of crown role holders',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'setup',
      description: 'Setup Hall of Fame channel',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'forum_channel',
          description: 'Select the forum channel where the updates will be posted',
          required: true,
          channel_types: [ChannelType.GuildForum],
          channelTypes: [ChannelType.GuildForum],
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
      preconditions: ['ModOnly'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          chatInputRun(interaction) {
            return interaction.reply({
              content:
                'Refresh initiated, please wait for a while before using hall of fame commands!',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun(interaction) {
            return interaction.reply({ content: 'Hall of Fame will be published soon.' });
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
