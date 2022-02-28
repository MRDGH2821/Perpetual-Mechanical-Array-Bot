import {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { Command } from '@ruinguard/core';
import { EmbedColor } from '../lib/constants.js';
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

  /**
   * tell a joke
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const jokeEmbed = new MessageEmbed(),
      type = (await interaction.options.getString('type')) || 'Any',
      urlAPI = `${baseAPI + type + blacklist}&safe-mode`,
      { data } = await axios.get(urlAPI);
    console.log('Joke: ', data);

    let joke = '';
    if (data.type === 'single') {
      joke = `${data.joke}`;
    }
    else {
      joke = `${data.setup}\n\n${data.delivery}`;
    }

    jokeEmbed
      .setColor(EmbedColor)
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        name: `Requested by ${interaction.user.tag}`
      })
      .setTitle(`**${data.category} Joke! (ID: ${data.id})**`)
      .setDescription(`${joke}`);

    await interaction.reply({
      content: `Selected type: ${type}`
    });
    await interaction.channel.send({
      components: [submitJoke],
      embeds: [jokeEmbed]
    });
  }
});
