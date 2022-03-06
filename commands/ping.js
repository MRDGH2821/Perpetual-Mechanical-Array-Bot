// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from '@ruinguard/core';
import { EmbedColor } from '../lib/constants.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot Ping'),

  /**
   * shows bot ping
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const pingEmb = new MessageEmbed()
        .setColor(EmbedColor)
        .setTitle('**Pinging**')
        .setDescription('Please wait...'),
      sent = await interaction.reply({
        embeds: [pingEmb],
        fetchReply: true
      });
    pingEmb
      .setTitle('**Pong!**')
      .setDescription(`Websocket ping: ${interaction.client.ws.ping}ms\nBot Ping: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`);
    await interaction.editReply({ embeds: [pingEmb] });
  }
});
