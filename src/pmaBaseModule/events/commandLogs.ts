import { IEvent } from 'botTypes/interfaces';
import { GatewayClientEvents } from 'detritus-client';
import { RequestTypes } from 'detritus-client-rest';
import { ClientEvents } from 'detritus-client/lib/constants';
import { ChannelIds, COLORS } from 'lib/Constants';

const commandLogs: IEvent = {
  event: ClientEvents.INTERACTION_CREATE,
  on: true,
  async listener(args: GatewayClientEvents.InteractionCreate) {
    const { interaction } = args;

    if (!interaction.isFromApplicationCommand) {
      return;
    }

    console.log('------');
    console.log(
      `${interaction.user.tag} in #${
        interaction.channel?.name
      } triggered an interaction.\nUser ID: ${
        interaction.user.id
      }\nCommand: ${interaction.data?.toString()}`,
    );
    console.log('---\nCommand Logs:');

    const logEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Interaction Log**',
      author: {
        name: interaction.user.tag,
        iconUrl: `${interaction.user.avatarUrl}`,
        url: interaction.user.jumpLink,
      },
      color: COLORS.EMBED_COLOR,
      thumbnail: {
        url: interaction.user.avatarUrl,
      },
      description: `${interaction.user} in ${
        interaction.channel
      } triggered an interaction.\nCommand: ${interaction.data?.toString()}`,
      timestamp: new Date().toISOString(),
      footer: {
        text: `ID: ${interaction.user.id}`,
      },
    };

    const logChannel = interaction.guild?.channels.get(ChannelIds.ARCHIVES);

    await logChannel?.createMessage({
      embeds: [logEmbed],
    });
  },
};

export default commandLogs;
