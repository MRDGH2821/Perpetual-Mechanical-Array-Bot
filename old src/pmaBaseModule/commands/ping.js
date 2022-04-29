import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, MessageEmbed } from '@ruinguard/core';
import { EMBED_COLOR } from '../../lib/Constants.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot ping'),

  async run(interaction) {
    const pingEmb = new MessageEmbed()
      .setTitle('**Pinging**')
      .setColor(EMBED_COLOR)
      .setDescription('Please wait...');
    const sent = await interaction.reply({
      embeds: [pingEmb],
      fetchReply: true,
    });
    pingEmb
      .setTitle('**Pong!**')
      .setDescription(
        `Websocket ping: ${interaction.client.ws.ping}ms\nBot Ping: ${
          sent.createdTimestamp - interaction.createdTimestamp
        }ms`,
      );
    await interaction.editReply({ embeds: [pingEmb] });
  },
});
