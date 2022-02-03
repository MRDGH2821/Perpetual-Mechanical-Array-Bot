import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { readFile } from 'fs/promises';
const json = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));

export default new Command({
  data: new SlashCommandBuilder().setName('help').setDescription('Need Help?'),

  async run(interaction) {
    const help = new MessageEmbed()
      .setColor('#524437')
      .setTitle('Help')
      .setDescription(`Need Help?\nBot version = ${json.version}`)
      .addFields(
        { name: '/amc', value: 'Shows various AMC techs' },
        {
          name: '/bonk',
          value:
            'Bonk a user <:KEKW:913272497405841408>\n(You can also specify a reason <:worrySmart:839141261411745802>)',
        },
        {
          name: '/calculator normal',
          value:
            'Your regular calculator. Usage is similar to [Math Notepad](https://mathnotepad.com/docs/overview.html). Some features might not be available like variables. This command uses [Math.js](https://api.mathjs.org/) API to solve expressions.',
        },
        {
          name: '/calculator dmg_compare',
          value:
            'This command allows you to compare two sets based only on three factors, namely Attack, Crit Rate and Crit Damage. \nThis serves as a simple way to compare sets, but is not the only way to evaluate which set is better since other variables (such as external bonuses or buffs) can exist. \nIdeally, you would want a damage value above 4000 for main dps units, and well-invested units tend to reach 5000+ damage values.\n\n**Note:** Damage values might vary in-game.',
        },
        {
          name: '/calculator damage',
          value:
            'This command allows you to calculate an estimated "damage" that you can achieve from three stats: Attack, Crit Rate and Crit Damage. \nIdeally, you would want a damage value above 4000 for main dps units, and well-invested units tend to reach 5000+ above damage values.\n\n**Note:** Damage values might vary in-game.',
        },
        {
          name: '/give-role',
          value: 'A mod only command which gives roles to users',
        },
        {
          name: '/gmc',
          value: 'Shows various GMC techs',
        },
        {
          name: '/help',
          value: 'The help command',
        },
        {
          name: '/joke',
          value:
            'Tells you a joke from given categories: Programming, Misc, Pun, Spooky & Christmas. By default any random category will be picked.',
        },
        {
          name: '/padoru',
          value: 'Sings padoru as text',
        },
      );
    return interaction.reply({ embeds: [help] });
  },
});
