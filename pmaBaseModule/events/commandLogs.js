// eslint-disable-next-line no-unused-vars
import { CommandInteraction, Event, MessageEmbed } from '@ruinguard/core';
import { EMBED_COLOR } from '../../lib/Constants.js';

export default new Event({
  event: 'interactionCreate',
  name: 'Command logs',
  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    if (interaction.isApplicationCommand()) {
      console.log('------');

      console.log(
        `${interaction.user.tag} in #${
          interaction.channel.name
        } triggered an interaction.\nUser ID: ${
          interaction.user.id
        }\nCommand: ${interaction.commandName} \nSubcommand: \n - Group: ${
          interaction.options.getSubcommandGroup(false) || 'N/A'
        } \n - Name: ${interaction.options.getSubcommand(false) || 'N/A'}`,
      );

      console.log('---\nCommand Logs:');
      const avatarUrl = interaction.user.displayAvatarURL({
        dynamic: true,
      });
      const logEmbed = new MessageEmbed()
        .setTitle('**Interaction log**')
        .setAuthor({
          iconURL: avatarUrl,
          name: interaction.user.tag,
        })
        .setColor(EMBED_COLOR)
        .setThumbnail(avatarUrl)
        .setDescription(
          `${interaction.user} in ${interaction.channel} triggered an interaction.`,
        )
        .addFields([
          {
            name: '**Command**',
            value: `${interaction.commandName}`,
          },
          {
            name: '**Subcommand**',
            value: `Group: ${
              interaction.options.getSubcommandGroup(false) || 'N/A'
            }\nName: ${interaction.options.getSubcommand(false) || 'N/A'}`,
          },
        ])
        .setTimestamp()
        .setFooter({ text: `ID: ${interaction.user.id}` });
      const logchannel = await interaction.guild.channels.fetch(
        '806110144110919730',
      );

      logchannel.send({
        embeds: [logEmbed],
      });
    }
  },
});
