import { ApplyOptions } from '@sapphire/decorators';
import { container, Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { ChannelIds, COLORS } from '../../lib/Constants';

@ApplyOptions<ListenerOptions>({
  name: 'CommandLogs',
  event: Events.ChatInputCommandFinish,
})
export default class CommandLogs extends Listener<typeof Events.ChatInputCommandFinish> {
  public async run(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (!interaction.guild) {
      return;
    }

    const { user } = interaction;

    const logChannel = await interaction.guild?.channels.fetch(ChannelIds.ARCHIVES);

    if (!logChannel?.isTextBased()) {
      throw new Error('Cannot fetch log channel');
    }

    const subCommand = {
      cmd: 'none',
      group: 'none',
    };

    try {
      subCommand.group = interaction.options.getSubcommandGroup() || 'none';
      subCommand.cmd = interaction.options.getSubcommand() || 'none';
    } catch (e) {
      container.logger.info('There are no sub commands in this guild command');
    }

    logChannel.send({
      embeds: [
        {
          title: '**Interaction Log**',
          author: {
            name: user.tag,
            icon_url: user.displayAvatarURL(),
          },
          color: COLORS.EMBED_COLOR,
          thumbnail: {
            url: user.displayAvatarURL(),
          },
          description: `${user} \`${user.tag}\` in ${interaction.channel} triggered an interaction.\n\n**Command:** ${interaction.commandName}\n**Sub Command Group:** ${subCommand.group}\n**Sub Command:** ${subCommand.cmd}`,

          timestamp: new Date(interaction.createdTimestamp).toISOString(),
          footer: {
            text: `ID: ${interaction.user.id}`,
          },
        },
      ],
    });
  }
}
