import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';

const cmd = new SlashCommandBuilder()
  .setName('amc')
  .setDescription('Anemo Main Character')
  .addSubcommand((subcommand) => subcommand
    .setName('gust_surge')
    .setDescription('AMC Burst')
    .addStringOption((option) => option
      .setName('techs')
      .setDescription('Technologies which power burst')
      .setRequired(true)
      .addChoice('Cyronado: Guoba', 'cyronadoguoba')
      .addChoice('Cyronado: Baron Bunny', 'cyronadobaron')));
export default new Command({
  data: cmd,
  async run(interaction) {
    await interaction.deferReply('gmc');
    const option = interaction.options.getString('techs');
    let gif;
    let name;
    switch (option) {
    case 'cyronadoguoba':
      gif = 'https://i.imgur.com/v2OWCkz.mp4';
      name = 'Cyronado: Guoba';
      break;
    case 'cyronadobaron':
      gif = 'https://i.imgur.com/sjEmHjY.mp4';
      name = 'Cyronado: Baron Bunny';
      break;
    }
    await interaction.editReply({ content: `**${name}**\n\n${gif}` });
  },
});
