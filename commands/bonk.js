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
    const reasons = [
      'Unspecified',
      '||For no reason :joy:||',
      'You need no reason to be told',
      'Because you are my Test Subject uwu',
      'Ah my hands slipped',
      'Just because...',
      'Because why not <:BoreasKek:829620211190595605>',
    ];
    const inputReason = await interaction.options.getString('reason');
    const reason
      = inputReason || reasons[Math.floor(Math.random() * reasons.length)];

    const isHorny
      = /h+o+r+n+y/gm.test(inputReason)
      || /s+e+g+s/gm.test(inputReason)
      || /s+e+x/gm.test(inputReason);
    const isSelf = user === interaction.user;

    const gifs = [
      'https://c.tenor.com/CsXEC2e1F6MAAAAC/klee-klee-bonk.gif',
      'https://c.tenor.com/KGlqdROpWEEAAAAd/genshin-keqing.gif',
      'https://c.tenor.com/636jxoYmHfgAAAAd/bonk-ultimate-bonk.gif',
      'https://c.tenor.com/GQVoTVtfLvoAAAAC/psyduck-farfetchd.gif',
      'https://c.tenor.com/yaEqa7kN91MAAAAd/zhongli-bonk.gif',
      'https://c.tenor.com/tfgcD7qcy1cAAAAC/bonk.gif',
    ];
    console.log('Bonk GIFs', gifs);

    const hornyBonkGifs = [
      'https://c.tenor.com/8pGG6mJFMRsAAAAM/bonk-bonk-go-to-jail.gif',
      'https://c.tenor.com/TKbDxDPCkegAAAAC/horny-jail-go-to-horny-jail.gif',
    ];
    console.log('Horny Bonk GIFs', hornyBonkGifs);

    const selfHornyBonkGifs = hornyBonkGifs.concat(['https://c.tenor.com/wCqp5yu_7awAAAAS/horny-bonk-bonk.gif']);
    console.log('Self Horny Bonk GIFs', selfHornyBonkGifs);

    const gif = gifs[Math.floor(Math.random() * gifs.length)];
    console.log('Selected Bonk: ', gif);

    const selfHornyBonkGif
      = selfHornyBonkGifs[Math.floor(Math.random() * selfHornyBonkGifs.length)];
    console.log('Selected Self Horny Bonk', selfHornyBonkGif);

    const hornyBonkGif
      = hornyBonkGifs[Math.floor(Math.random() * hornyBonkGifs.length)];
    console.log('Selected Horny Bonk: ', hornyBonkGif);

    const bonk = new MessageEmbed()
      .setColor('#524437')
      .setTitle('**Bonked!**')
      .setThumbnail(await user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${user} has been bonked!\nReason: ${reason}`)
      .setImage(gif);

    const hornyBonk = new MessageEmbed()
      .setColor('#524437')
      .setTitle('**Bonked!**')
      .setThumbnail(await user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${user} has been bonked!\nReason: ${reason}`)
      .setImage(hornyBonkGif);

    const selfHornyBonk = new MessageEmbed()
      .setColor('#524437')
      .setTitle('**Bonked!**')
      .setThumbnail(await user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${user} has been bonked!\nReason: ${reason}`)
      .setImage(selfHornyBonkGif);

    if (!isHorny) {
      return interaction.reply({ embeds: [bonk] });
    } else if (isSelf) {
      return interaction.reply({ embeds: [selfHornyBonk] });
    }
    return interaction.reply({ embeds: [hornyBonk] });
  },
});
