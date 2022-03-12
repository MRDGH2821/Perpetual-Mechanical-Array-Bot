/* eslint-disable no-magic-numbers */
import { SlashCommandBuilder, hyperlink } from '@discordjs/builders';
import { Command } from '@ruinguard/core';
import { MessageEmbed } from 'discord.js';
import { elementIcon } from '../lib/constants.js';
// import { leaderboardData } from '../lib/LeaderboardManager.js';

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
      dmgProps = elementIcon(dmgCategory),
      leaderboardEmbed = new MessageEmbed()
        .setTitle(`${dmgProps.name} Damage Leaderboard`)
        .setColor(dmgProps.color)
        .setThumbnail(dmgProps.icon)
        .setDescription(`Highest Damage number of **${dmgProps.skill}**`);

    let leaderboardCacheData = {},
      rank = 1,
      topOpen = '',
      topSolo = '';

    switch (dmgCategory) {
    case 'anemo-dmg-skill': {
      leaderboardCacheData = interaction.client.leaderboards.anemo.skill;
      break;
    }
    case 'geo-dmg-skill': {
      leaderboardCacheData = interaction.client.leaderboards.geo.skill;
      break;
    }
    case 'electro-dmg-skill': {
      leaderboardCacheData = interaction.client.leaderboards.electro.skill;
      break;
    }
    case 'uni-dmg-n5': {
      leaderboardCacheData = interaction.client.leaderboards.universal.n5;
      break;
    }
      // no default
    }

    for (const [, dataCache] of leaderboardCacheData.open) {
      if (rank === 14) {
        break;
      }
      topOpen = `${topOpen}\n${rank}. ${dataCache.User.tag} - ${hyperlink(
        `${dataCache.data.score}`,
        dataCache.data.proof
      )}`;
      rank += 1;
    }
    rank = 1;
    for (const [, dataCache] of leaderboardCacheData.solo) {
      if (rank === 14) {
        break;
      }
      topSolo = `${topSolo}\n${rank}. ${dataCache.User.tag} - ${hyperlink(
        `${dataCache.data.score}`,
        dataCache.data.proof
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
