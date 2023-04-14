import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType, ChannelType, MessageFlags } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';

const cmdDef: JSONCmd = {
  name: 'sa-mod',
  description: 'Spiral Abyss mod only commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Spiral Abyss cache',
    },
    {
      type: 1,
      name: 'publish',
      description: 'Publishes the names of crown role holders',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'setup',
      description: 'Setup Spiral Abyss channel',
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
          chatInputRun(interaction) {
            PMAEventHandler.emit('SARefresh');
            return interaction.reply({
              content:
                'Refresh initiated, please wait for a while before using Spiral Abyss commands!',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun(interaction) {
            PMAEventHandler.emit('SAPublish');
            return interaction.reply({
              content: 'Spiral Abyss will be published soon.',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',
          chatInputRun(interaction) {
            const forumChannel = interaction.options.getChannel<ChannelType.GuildForum>(
              'forum_channel',
              true,
              [ChannelType.GuildForum],
            );

            PMAEventHandler.emit('SASetup', forumChannel);
            return interaction.reply({
              content: `Spiral Abyss updates will now arrive in ${forumChannel}`,
              flags: MessageFlags.Ephemeral,
            });
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
