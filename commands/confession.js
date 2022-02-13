import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
/* const conftext = '𝒲𝒶𝓃𝓃𝒶 𝒸𝑜𝓃𝒻𝑒𝓈𝓈 𝓈𝑜𝓂𝑒𝓉𝒽𝒾𝓃𝑔?';
   console.log(conftext); */

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
    const confessionchannel = await interaction.guild.channels.fetch('938763983551356928');
    const logchannel = await interaction.guild.channels.fetch('806110144110919730');

    const confessionText = await interaction.options.getString('confess');
    const anonymous
      = (await interaction.options.getBoolean('anonymous')) || false;
    const userAvatar = await interaction.user.displayAvatarURL({ dynamic: true });

    const confessEmbed = new MessageEmbed()
      .setColor('524437')
      .setDescription(`${confessionText}`)
      .setThumbnail(userAvatar)
      .setTimestamp()
      .setTitle('**A New Confession!**')
      .setAuthor({
        name: await interaction.user.tag,
        iconURL: userAvatar,
      });

    const anonEmbed = new MessageEmbed()
      .setColor('524437')
      .setDescription(`${confessionText}`)
      .setTimestamp()
      .setTitle('**A New Confession!**')
      .setAuthor({ name: 'Anonymous' });

    if (anonymous) {
      confessionchannel.send({ embeds: [anonEmbed] });
      await interaction.reply({
        content: `Confession sent as Anonymous!\nCheck out ${confessionchannel}`,
        ephemeral: true,
      });
    } else {
      confessionchannel.send({ embeds: [confessEmbed] });
      await interaction.reply({
        content: 'Confession sent!\nCheck out ${confessionchannel}',
        ephemeral: true,
      });
    }
    logchannel.send({ embeds: [confessEmbed] });
  },
});
