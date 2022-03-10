/* eslint-disable no-magic-numbers */
import { SlashCommandBuilder, hyperlink } from '@discordjs/builders';
import { Command } from '@ruinguard/core';
import { MessageEmbed } from 'discord.js';
import { elementIcon } from '../lib/constants.js';
import { leaderboardData } from '../lib/LeaderboardManager.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('view_leaderboard')
    .setDescription('View Damage Leaderboard')
    .addStringOption((option) => option
      .setName('category')
      .setDescription('Damage category')
      .setRequired(true)
      .addChoice('Anemo: Palm Vortex', 'anemo-dmg-skill')
      .addChoice('Geo: Starfell Sword', 'geo-dmg-skill')
      .addChoice('Electro: Lightening Blade', 'electro-dmg-skill')
      .addChoice('Universal: 5th Normal Atk dmg', 'uni-dmg-n5')),

  async run(interaction) {
    await interaction.deferReply();
    const dmgCategory = interaction.options.getString('category'),
      dmgDataOpen = await leaderboardData(dmgCategory, 'open', 14),
      dmgDataSolo = await leaderboardData(dmgCategory, 'solo', 14),
      dmgProps = elementIcon(dmgCategory),
      leaderboardEmbed = new MessageEmbed()
        .setTitle(`${dmgProps.name} Damage Leaderboard`)
        .setColor(dmgProps.color)
        .setThumbnail(dmgProps.icon)
        .setDescription(`Highest Damage number of **${dmgProps.skill}**`);

    let rank = 1,
      topOpen = '',
      topSolo = '';
    for (const data of dmgDataOpen) {
      // dmgDataOpen.forEach(async(data) => {
      // eslint-disable-next-line no-await-in-loop
      const userTag = (await interaction.client.users.fetch(data.userID)).tag;
      topOpen = `${topOpen}\n${rank}. ${userTag} - ${hyperlink(
        `${data.score}`,
        data.proof
      )}`;
      rank += 1;
    }
    rank = 1;
    for (const data of dmgDataSolo) {
      // await dmgDataSolo.forEach(async(data) => {
      // eslint-disable-next-line no-await-in-loop
      const userTag = (await interaction.client.users.fetch(data.userID)).tag;
      topSolo = `${topSolo}\n${rank}. ${userTag} - ${hyperlink(
        `${data.score}`,
        data.proof
      )}`;
      rank += 1;
    }

    leaderboardEmbed.addFields([
      {
        name: '**Solo Category**',
        value: topSolo
      },
      {
        inline: true,
        name: '**Open Category**',
        value: topOpen
      }
    ]);

    await interaction.editReply({
      embeds: [leaderboardEmbed]
    });
  }
});
