import { Event } from '@ruinguard/core';

export default new Event({
  event: 'interactionCreate',
  async run(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\nUser ID: ${interaction.user.id}, Command: ${interaction.commandName}\n---`);

    const logchannel = await interaction.guild.channels.fetch('806110144110919730');
    const avatarUrl = await interaction.user.displayAvatarURL({ dynamic: true });
    logchannel.send({
      embeds: [
        {
          color: 0x524437,
          author: {
            name: await interaction.user.tag,
            // eslint-disable-next-line camelcase
            icon_url: avatarUrl,
          },
          title: '**Interaction log**',
          thumbnail: { url: avatarUrl },
          description: `${interaction.user} in ${interaction.channel} triggered an interaction.`,
          fields: [
            {
              name: '**Command Name**',
              value: `${interaction.commandName}`,
            },
            {
              name: '**User ID**',
              value: `${interaction.user.id}`,
            },
          ],

        },
      ],
    });

    interaction.client._onInteractionCreate(interaction);
  },
});
