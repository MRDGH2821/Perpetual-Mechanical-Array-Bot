import { MessageActionRow, MessageButton } from 'discord.js';
import { Command } from '@ruinguard/core';
import { EmbedColorHex } from '../lib/constants.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';

const baseAPI = 'https://v2.jokeapi.dev/joke/',
  blacklist = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit',
  cmd = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke!')
    .addStringOption((option) => option
      .setName('type')
      .setDescription('Select category of joke')
      .addChoice('Programming', 'Programming')
      .addChoice('Misc', 'Misc')
      .addChoice('Pun', 'Pun')
      .addChoice('Spooky', 'Spooky')
      .addChoice('Christmas', 'Christmas')
      .addChoice('Any', 'Any')),
  submitJoke = new MessageActionRow().addComponents(new MessageButton()
    .setLabel('Submit a joke!')
    .setStyle('LINK')
    .setURL('https://jokeapi.dev/#submit'));

export default new Command({
  data: cmd,
  async run(interaction) {
    const type = (await interaction.options.getString('type')) || 'Any',
      apiURL = `${baseAPI + type + blacklist}&safe-mode`;
    console.log('API URL: ', apiURL);

    const { data } = await axios.get(apiURL);
    console.log('Joke: ', data);

    let joke = '';
    if (data.type === 'single') {
      joke = `${data.joke}`;
    }
    else {
      joke = `${data.setup}\n\n${data.delivery}`;
    }

    const jokeEmbed = {
      color: EmbedColorHex,
      title: `**${data.category} Joke!**`,
      description: `${joke}`,
      footer: {
        text: `Requested by ${interaction.user.tag}, Joke ID: ${data.id}`,
        // eslint-disable-next-line camelcase
        icon_url: await interaction.user.displayAvatarURL({ dynamic: true })
      }
    };
    await interaction.reply({
      content: `Selected type: ${type}`,
      ephemeral: true
    });
    await interaction.channel.send({
      embeds: [jokeEmbed],
      components: [submitJoke]
    });
  }
});
