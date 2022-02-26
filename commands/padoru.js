import {
  SlashCommandBuilder,
  channelMention,
  formatEmoji,
  roleMention
} from '@discordjs/builders';
import { botSpamID, commandCenterID } from '../lib/channelIDs.js';
import { Command } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from 'discord.js';
import { LuminePadoru } from '../lib/emoteIDs.js';
import { archonsID } from '../lib/roleIDs.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('padoru')
    .setDescription('Will sing Padoru (as text)'),

  /**
   * will sing padoru as text
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const { channel } = interaction;
    if (channel.id === botSpamID || channel.id === commandCenterID) {
      await interaction.reply({
        content: `Merry Christmas ${interaction.user.tag}!`
      });
      await channel.send(`${roleMention(archonsID)} Hashire sori yo`);
      await channel.send(`${roleMention(archonsID)} Kazeno yuu ni`);
      await channel.send(`${roleMention(archonsID)} Tsukkimihara wo`);
      await channel.send(`${roleMention(archonsID)} PADORU PADORU`);
      await channel.send(`${formatEmoji(LuminePadoru)}${formatEmoji(LuminePadoru)}${formatEmoji(LuminePadoru)}${formatEmoji(LuminePadoru)}`);
      await channel.send({ stickers: ['912034014112649276'] });
    }
    else {
      await interaction.reply({
        content: `Please use ${channelMention(botSpamID)}`,
        ephemeral: true
      });
    }
  }
});
