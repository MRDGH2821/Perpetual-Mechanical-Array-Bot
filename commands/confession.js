import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { EmbedColor } from '../lib/constants.js';

const cmd = new SlashCommandBuilder()
  .setName('confession')
  .setDescription('Wanna confess something?')
  .addStringOption((option) => option
    .setName('confess')
    .setDescription('Enter your confession!')
    .setRequired(true))
  .addBooleanOption((option) => option.setName('anonymous').setDescription('Want to be Anonymous?'));

export default new Command({
  data: cmd,

  async run(interaction) {
    const confessionchannel = await interaction.guild.channels.fetch('938763983551356928'),
      logchannel = await interaction.guild.channels.fetch('806110144110919730'),

      confessionText = await interaction.options.getString('confess'),
      anonymous =
      (await interaction.options.getBoolean('anonymous')) || false,
      userAvatar = await interaction.user.displayAvatarURL({
        dynamic: true
      }),

      confessEmbed = new MessageEmbed()
        .setColor(EmbedColor)
        .setDescription(`${confessionText}`)
        .setThumbnail(userAvatar)
        .setTimestamp()
        .setTitle('**A New Confession!**')
        .setAuthor({
          name: await interaction.user.tag,
          iconURL: userAvatar
        }),

      anonEmbed = new MessageEmbed()
        .setColor(EmbedColor)
        .setDescription(`${confessionText}`)
        .setTimestamp()
        .setTitle('**A New Confession!**')
        .setAuthor({ name: 'Anonymous' });

    if (anonymous) {
      confessionchannel.send({ embeds: [anonEmbed] });
      await interaction.reply({
        content: `Confession sent as Anonymous!\nCheck out ${confessionchannel}`,
        ephemeral: true
      });
    }
    else {
      confessionchannel.send({ embeds: [confessEmbed] });
      await interaction.reply({
        content: `Confession sent!\nCheck out ${confessionchannel}`,
        ephemeral: true
      });
    }
    logchannel.send({ embeds: [confessEmbed] });
  }
});
