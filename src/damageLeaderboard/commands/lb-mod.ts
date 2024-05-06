import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType, ChannelType, MessageFlags } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';

const cmdDef: JSONCmd = {
  name: 'lb-mod',
  description: 'Leaderboard mod only commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Leaderboard cache',
    },
    {
      type: 1,
      name: 'update_summary',
      description: 'Updates the leaderboard',
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'setup',
      description: 'Setup Leaderboard Channels',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'summary_channel',
          description: 'Setup Leaderboard Summary Channel',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'Select the channel where the updates will be posted',
              required: true,
              channel_types: [ChannelType.GuildText],
              channelTypes: [ChannelType.GuildText],
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'forum_channel',
          description: 'Setup Leaderboard Forum Channel',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'forum_channel',
              description: 'Select the channel where the updates will be posted',
              required: true,
              channel_types: [ChannelType.GuildForum],
              channelTypes: [ChannelType.GuildForum],
            },
          ],
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'publish_forum',
      description: 'Publishes leaderboard in forum channel',
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
          async chatInputRun(interaction) {
            PMAEventHandler.emit('LBRefresh');
            return interaction.reply({
              content:
                'Refresh initiated, please wait for a while before using Leaderboard commands!',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          async chatInputRun(interaction) {
            PMAEventHandler.emit('LBUpdate');
            return interaction.reply({
              content: 'Leaderboards will be updated soon.',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![2].name,
          type: 'group',
          entries: [
            {
              name: 'summary_channel',
              type: 'method',

              async chatInputRun(interaction) {
                const textChannel = interaction.options.getChannel<ChannelType.GuildText>(
                  'channel',
                  true,
                  [ChannelType.GuildText],
                );

                PMAEventHandler.emit('LBSetup', { textChannel });
                return interaction.reply({
                  content: `Leaderboard Summary updates will now arrive in ${textChannel}`,
                  flags: MessageFlags.Ephemeral,
                });
              },
            },
            {
              name: 'forum_channel',
              type: 'method',
              async chatInputRun(interaction) {
                const forumChannel = interaction.options.getChannel<ChannelType.GuildForum>(
                  'forum_channel',
                  true,
                  [ChannelType.GuildForum],
                );

                PMAEventHandler.emit('LBSetup', { forumChannel });
                return interaction.reply({
                  content: `Leaderboard Forum updates will now arrive in ${forumChannel}`,
                  flags: MessageFlags.Ephemeral,
                });
              },
            },
          ],
        },
        {
          name: cmdDef.options![3].name,
          type: 'method',
          async chatInputRun(interaction) {
            PMAEventHandler.emit('LBPublish');
            return interaction.reply({
              content: 'Leaderboards will be published soon.',
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
