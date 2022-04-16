import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, MessageEmbed } from '@ruinguard/core';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot ping'),

  async run(interaction) {
    const pingEmb = new MessageEmbed()
      .setTitle('**Pinging**')
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
