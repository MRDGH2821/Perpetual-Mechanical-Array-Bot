import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';
import axios from 'axios';

const baseAPI = 'https://v2.jokeapi.dev/joke/';
const blacklist
  = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';

const cmd = new SlashCommandBuilder()
  .setName('joke')
  .setDescription('Get a random joke!')
  .addStringOption(option => option
    .setName('type')
    .setDescription('Select category of joke')
    .addChoice('Programming', 'Programming')
    .addChoice('Misc', 'Misc')
    .addChoice('Pun', 'Pun')
    .addChoice('Spooky', 'Spooky')
    .addChoice('Christmas', 'Christmas')
    .addChoice('Any', 'Any'));

const submitJoke = new MessageActionRow().addComponents(new MessageButton()
  .setLabel('Submit a joke!')
  .setStyle('LINK')
  .setURL('https://jokeapi.dev/#submit'));

export default new Command({
  data: cmd,
  async run(interaction) {
    const type = (await interaction.options.getString('type')) || 'Any';

    const apiURL = `${baseAPI + type + blacklist}&safe-mode`;
    console.log('API URL: ', apiURL);

    const { data } = await axios.get(apiURL);
    console.log('Joke: ', data);

    let joke = '';
    if (data.type === 'single') {
      joke = `${data.joke}`;
    } else {
      joke = `${data.setup}\n\n${data.delivery}`;
    }

    const jokeEmbed = {
      color: 0x524437,
      title: `**${data.category} Joke!**`,
      description: `${joke}`,
      footer: {
        text: `Requested by ${interaction.user.tag}, Joke ID: ${data.id}`,
        icon_url: await interaction.user.displayAvatarURL({ dynamic: true }),
      },
    };
    await interaction.reply({
      content: `Selected type: ${type}`,
      ephemeral: true,
    });
    await interaction.channel.send({
      embeds: [jokeEmbed],
      components: [submitJoke],
    });
  },
});
