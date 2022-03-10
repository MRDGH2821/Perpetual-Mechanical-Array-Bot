/* eslint-disable no-magic-numbers */
import {
  SlashCommandBuilder,
  hyperlink,
  userMention
} from '@discordjs/builders';
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
    dmgDataOpen.forEach((data) => {
      topOpen = `${topOpen}\n${rank}. ${userMention(data.userID)} - ${hyperlink(
        `${data.score}`,
        data.proof
      )}`;
      rank += 1;
    });
    rank = 1;
    dmgDataSolo.forEach((data) => {
      topSolo = `${topSolo}\n${rank}. ${userMention(data.userID)} - ${hyperlink(
        `${data.score}`,
        data.proof
      )}`;
      rank += 1;
    });

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

    /*
    let top7open = '',
      top7solo = '',
      top8to14open = '',
      top8to14solo = '';
    for (let idx = 0; idx < 7; idx++) {
      console.log('Iteration: ', idx);

      const openDmgData = dmgDataOpen[idx],
        openDmgData8 = dmgDataOpen[idx + 7],
        soloDmgData = dmgDataSolo[idx],
        soloDmgData8 = dmgDataSolo[idx + 7];

      console.log('Open dmg data:', openDmgData);
      console.log('Solo dmg data:', soloDmgData);
      console.log('Open dmg8 data:', openDmgData8);
      console.log('Solo dmg8 data:', soloDmgData8);

      top7open = `${top7open}\n${openDmgData.userID || ' '} -
          [${openDmgData.score}](${openDmgData.proof})`;

      top8to14open = `${top8to14open}\n${openDmgData8.userID || ' '} - [${
        openDmgData8.score
      }](${openDmgData8.proof})`;

      top7solo = `${top7solo}\n${soloDmgData.userID || ' '} - [${
        soloDmgData.score
      }](${soloDmgData.proof})`;

      top8to14solo = `${top8to14solo}\n${soloDmgData8.userID || ' '} - [${
        soloDmgData8.score
      }](${soloDmgData8.proof})`;
    }

    leaderboardEmbed.addFields([
      {
        name: '**Solo Traveler**',
        value: top7solo
      },
      {
        inline: true,
        name: '\u200b',
        value: top8to14solo
      },
      {
        name: '**Open Traveler**',
        value: top7open
      },
      {
        inline: true,
        name: '\u200b',
        value: top8to14open
      }
    ]);
*/
    await interaction.editReply({
      embeds: [leaderboardEmbed]
    });
  }
});
