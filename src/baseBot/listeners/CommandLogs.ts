import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { ChannelIds, COLORS } from '../../lib/Constants';

@ApplyOptions<ListenerOptions>({
  name: 'CommandLogs',
  event: Events.InteractionCreate,
})
export default class CommandLogs extends Listener<typeof Events.InteractionCreate> {
  public async run(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const { user } = interaction;

    const logChannel = await interaction.guild?.channels.fetch(ChannelIds.ARCHIVES);

    if (!logChannel?.isTextBased()) {
      throw new Error('Cannot fetch log channel');
    }

    logChannel.send({
      embeds: [
        {
          title: '**Interaction Log**',
          author: {
            name: user.username,
            icon_url: user.displayAvatarURL(),
          },
          color: COLORS.EMBED_COLOR,
          thumbnail: {
            url: user.displayAvatarURL(),
          },
          description: `${user} \`${user.username}\` in ${
            interaction.channel
          } triggered an interaction.\n\n**Command:** ${
            interaction.commandName
          }\n**Sub Command Group:** ${interaction.options.getSubcommandGroup()}\nSub Command: ${interaction.options.getSubcommand()}`,

          timestamp: interaction.createdTimestamp.toString(),
          footer: {
            text: `ID: ${interaction.user.id}`,
          },
        },
      ],
    });
  }
}
