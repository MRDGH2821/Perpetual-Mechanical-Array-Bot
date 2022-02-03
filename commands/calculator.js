import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
const cmd = new SlashCommandBuilder()
  .setName('calculator')
  .setDescription('Calculates Stuff')
  .addSubcommand(subcommand => subcommand
    .setName('normal')
    .setDescription('Functions like your regular calculator')
    .addStringOption(option => option
      .setName('expression')
      .setDescription('Enter expression')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('damage')
    .setDescription('Calculates damage of your character')
    .addNumberOption(option => option
      .setName('total_attack')
      .setDescription('Enter total attack')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_rate')
      .setDescription('Enter Critical Rate%')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_dmg')
      .setDescription('Enter Critical Dmg%')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('dmg_compare')
    .setDescription('Compares Damage of character equipping 2 different sets')
    .addNumberOption(option => option
      .setName('atk_1')
      .setDescription('Enter total attack for Set 1')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_rate_1')
      .setDescription('Enter Critical Rate% for Set 1')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_dmg_1')
      .setDescription('Enter Critical Dmg% for Set 1')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('atk_2')
      .setDescription('Enter total attack for Set 2')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_rate_2')
      .setDescription('Enter Critical Rate% for Set 2')
      .setRequired(true))
    .addNumberOption(option => option
      .setName('crit_dmg_2')
      .setDescription('Enter Critical Dmg% for Set 2')
      .setRequired(true)));

export default new Command({
  data: cmd,

  async run(interaction) {
    await interaction.deferReply('Calculating');
    console.log(interaction.options.getSubcommand());
    switch (await interaction.options.getSubcommand()) {
    case 'normal': {
      const expression = await interaction.options.getString('expression');
      const { data } = await axios({
        method: 'get',
        url: `http://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}&precision=2`,
        headers: {},
      });
      const result = data;
      console.log(expression, '=', result);
      await interaction.editReply({
        embeds: [
          {
            color: 0x524437,
            title: '**Calculation**',
            description: `**\`${expression}\`** = **\`${result}\`**`,
          },
        ],
      });
      break;
    }
    case 'damage': {
      const atk = await interaction.options.getNumber('total_attack');
      const cr = await interaction.options.getNumber('crit_rate');
      const cdmg = await interaction.options.getNumber('crit_dmg');
      const cproduct = (cr / 100) * (cdmg / 100);
      const result = atk * (1 + cproduct);
      await interaction.editReply({
        embeds: [
          {
            color: 0x524437,
            title: 'Damage Calculation',
            fields: [
              {
                name: '**Stats**',
                value: `Attack: \`${atk}\` \nCrit Rate: \`${cr}%\` \nCrit Damage: \`${cdmg}%\``,
              },
              {
                name: '**Result**',
                value: `${atk} * (1 + (${cr / 100} * ${cdmg / 100})) = **${
                  Math.round(result * 100) / 100
                }**`,
              },
            ],
          },
        ],
      });
      break;
    }
    case 'dmg_compare': {
      const atk1 = await interaction.options.getNumber('atk_1');
      const cr1 = await interaction.options.getNumber('crit_rate_1');
      const cdmg1 = await interaction.options.getNumber('crit_dmg_1');
      const atk2 = await interaction.options.getNumber('atk_2');
      const cr2 = await interaction.options.getNumber('crit_rate_2');
      const cdmg2 = await interaction.options.getNumber('crit_dmg_2');

      const cprod1 = (cr1 / 100) * (cdmg1 / 100);
      const cprod2 = (cr2 / 100) * (cdmg2 / 100);

      const result1 = atk1 * (1 + cprod1);
      const result2 = atk2 * (1 + cprod2);

      let preferred;
      if (result1 > result2) {
        preferred = 'First Set preferred';
      } else if (result1 < result2) {
        preferred = 'Second Set preferred';
      } else {
        preferred = 'Any set should do';
      }

      await interaction.editReply({
        embeds: [
          {
            color: 0x524437,
            title: `**Damage Comparision**`,
            fields: [
              {
                name: '**First Set**',
                value: `Attack: \`${atk1}\` \nCrit Rate: \`${cr1}%\` \nCrit Damage: \`${cdmg1}%\` \n\nResult: \`${
                  Math.round(result1 * 100) / 100
                }\``,
              },
              {
                name: '**Second Set**',
                value: `Attack: \`${atk2}\` \nCrit Rate: \`${cr2}%\` \nCrit Damage: \`${cdmg2}%\` \n\nResult: \`${
                  Math.round(result2 * 100) / 100
                }\``,
              },
              {
                name: '**Verdict**',
                value: preferred,
              },
            ],
          },
        ],
      });
      break;
    }
    }
  },
});
