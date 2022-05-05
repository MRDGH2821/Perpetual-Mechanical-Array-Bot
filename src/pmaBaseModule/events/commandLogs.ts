import { GatewayClientEvents, GatewayRawEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import { CHANNEL_IDS, COLORS } from '../../lib/Constants';
import { IEvent } from '../../types/interfaces';

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

    const logEmbed: GatewayRawEvents.RawMessageEmbed = {
      title: '**Interaction Log**',
      author: {
        name: interaction.user.tag,
        icon_url: `${interaction.user.avatarUrl}`,
        proxy_icon_url: interaction.user.avatarUrl,
        url: interaction.user.jumpLink,
      },
      color: COLORS.EMBED_COLOR,
      thumbnail: {
        url: interaction.user.avatarUrl,
        proxy_url: interaction.user.avatarUrl,
      },
      description: `${interaction.user} in ${
        interaction.channel
      } triggered an interaction.\nCommand: ${interaction.data?.toString()}`,
      //  timestamp: new Date().toString(),
      footer: {
        text: `ID: ${interaction.user.id}`,
      },
    };
    console.log(logEmbed);
    const logChannel = interaction.guild?.channels.get(CHANNEL_IDS.ARCHIVES);

    await logChannel?.createMessage({
      embeds: [logEmbed],
    });
  },
};

export default commandLogs;
