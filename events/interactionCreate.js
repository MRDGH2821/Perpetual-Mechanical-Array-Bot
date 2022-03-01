/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Interaction, MessageEmbed } from 'discord.js';
import { EmbedColor } from '../lib/constants.js';
import { Event } from '@ruinguard/core';
import { archivesID } from '../lib/channelIDs.js';

export default new Event({
  event: 'interactionCreate',

  /**
   * interaction event
   * @async
   * @function run
   * @param {Interaction} interaction - interaction object
   */
  async run(interaction) {
    // eslint-disable-next-line padded-blocks
    try {
      if (interaction.isApplicationCommand()) {
        console.log('------');

        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\nUser ID: ${interaction.user.id}, Command: ${interaction.commandName}\n`);

        console.log('---\nCommand Logs:');

        const avatarUrl = interaction.user.displayAvatarURL({
            dynamic: true
          }),
          logEmbed = new MessageEmbed()
            .setTitle('**Interaction log**')
            .setAuthor({
              iconURL: avatarUrl,
              name: interaction.user.tag
            })
            .setColor(EmbedColor)
            .setThumbnail(avatarUrl)
            .setDescription(`${interaction.user} in ${interaction.channel} triggered an interaction.`)
            .addFields([
              {
                name: '**Command Name**',
                value: `${interaction.commandName}`
              },
              {
                name: '**User ID**',
                value: `${interaction.user.id}`
              }
            ]),
          logchannel = await interaction.guild.channels.fetch(archivesID);

        logchannel.send({
          embeds: [logEmbed]
        });
      }

      // eslint-disable-next-line no-underscore-dangle
      await interaction.client._onInteractionCreate(interaction);
    }
    catch (error) {
      console.error(error);
    }
  }
});
