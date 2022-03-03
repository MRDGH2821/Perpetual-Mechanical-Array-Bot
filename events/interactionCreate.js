import { AMCTechs, GMCTechs } from '../lib/TravelerTechnologies.js';
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

      if (interaction.isAutocomplete()) {
        console.log('Loading Auto-complete');
        switch (interaction.options.getSubcommand()) {
        case 'palm_vortex': {
          console.log('Loading AMC Skill techs');
          const focusedVal = interaction.options.getFocused(),
            values = AMCTechs.skillTechs.filter((choice) => choice.name.startsWith(focusedVal));
          await interaction.respond(values.map((choice) => ({
            name: choice.name,
            value: choice.id
          })));
          break;
        }
        case 'gust_surge': {
          console.log('Loading AMC Burst techs');
          const focusedVal = interaction.options.getFocused(),
            values = AMCTechs.burstTechs.filter((choice) => choice.name.startsWith(focusedVal));
          await interaction.respond(values.map((choice) => ({
            name: choice.name,
            value: choice.id
          })));
          break;
        }
        case 'starfell_sword': {
          console.log('Loading GMC skill techs');
          const focusedVal = interaction.options.getFocused(),
            values = GMCTechs.skillTechs.filter((choice) => choice.name.startsWith(focusedVal));
          await interaction.respond(values.map((choice) => ({ name: choice.name, value: choice.id })));
          break;
        }
        case 'wake_of_earth': {
          console.log('Loading GMC burst techs');
          const focusedVal = interaction.options.getFocused(),
            values = GMCTechs.burstTechs.filter((choice) => choice.name.startsWith(focusedVal));
          await interaction.respond(values.map((choice) => ({ name: choice.name, value: choice.id })));
          break;
        }

        default: {
          console.log('There are no techs');
          const values = [{ name: 'No techs found.' }];
          await interaction.respond(values.map((choice) => ({ name: choice.name })));
          break;
        }
        }
      }

      // eslint-disable-next-line no-underscore-dangle
      await interaction.client._onInteractionCreate(interaction);
    }
    catch (error) {
      console.error(error);
    }
  }
});
