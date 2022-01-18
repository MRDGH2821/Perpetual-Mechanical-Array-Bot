import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

const cmd = new SlashCommandBuilder()
  .setName('bonk')
  .setDescription('Select a member and bonk them.')
  .addUserOption(option => option
    .setName('target')
    .setDescription('The member to bonk')
    .setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('Reason to bonk'));

export default new Command({
  data: cmd,
  flags: [1 << 1],
  async run(interaction) {
    const user = await interaction.options.getUser('target');
    const reasons = ['Unspecified', '||For no reason :joy:||'];
    const reason
      = (await interaction.options.getString('reason'))
      || reasons[Math.floor(Math.random() * reasons.length)];

    const gifs = [
      'https://c.tenor.com/CsXEC2e1F6MAAAAC/klee-klee-bonk.gif',
      'https://c.tenor.com/KGlqdROpWEEAAAAd/genshin-keqing.gif',
    ];
    // console.log(gifs);
    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    console.log(gif);
    const embed = new MessageEmbed()
      .setColor('#524437')
      .setTitle('**Bonked!**')
      .setThumbnail(await user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${user} has been bonked!\nReason: ${reason}`)
      .setImage(gif);
    return interaction.reply({ embeds: [embed] });
  },
});
