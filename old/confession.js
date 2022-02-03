import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
/* const conftext = '𝒲𝒶𝓃𝓃𝒶 𝒸𝑜𝓃𝒻𝑒𝓈𝓈 𝓈𝑜𝓂𝑒𝓉𝒽𝒾𝓃𝑔?';
   console.log(conftext); */

const cmd = new SlashCommandBuilder()
  .setName('confession')
  .setDescription('Wanna confess something?')
  .addStringOption(option => option.setName('confess').setRequired(true))
  .addBooleanOption(option => option.setName('anonymous'));

export default new Command({
  data: cmd,

  async run(interaction) {
    const confessionchannel = await interaction.guild.channels.fetch('938763983551356928');
    const logchannel = await interaction.guild.channels.fetch('806110144110919730');

    const confessionText = await interaction.options.getString('confession');
    const anonymous = await interaction.options.getBoolean('anonymous');

    const template = new MessageEmbed()
      .setColor('524437')
      .setDescription(confessionText)
      .setTimestamp()
      .setTitle('**A New Confession!**');

    const confessEmbed = template.setAuthor({
      name: await interaction.user.tag,
      iconURL: await interaction.user.displayAvatarURL({ dynamic: true }),
    });

    const anonEmbed = template.setAuthor({ name: 'Anonymous' });

    if (anonymous) {
      confessionchannel.send({ embeds: [anonEmbed] });
    } else {
      confessionchannel.send({ embeds: [confessEmbed] });
    }
    logchannel.send({ embeds: [confessEmbed] });

    await interaction.reply({
      content: 'Confession sent!',
      ephemeral: true,
    });
  },
});
